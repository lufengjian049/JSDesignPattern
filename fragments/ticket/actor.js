import {Event} from './Event';

const shortid = {
    generate: () => {}
};
//隐私属性
const privateProperties = new WeakMap();
class ActorSystem {
    constructor(name) {
        this.name = name;
        this.eventStream = new Event();
        const rootActorRef = new ActorRef(RootActor, this, [], [], 'root', 'root');
        privateProperties.set(this,rootActorRef);
        this.actorRelation = new Map();
    }
    static create(name) {
        return new ActorSystem(name);
    }
    // tell message to actor by system.eventStream
    tell(event, message) {
        this.eventStream.emit(event, message);
    }
    /**
   * broadcast message all to system.
   * @param message
   * @param volume you can set the volume to positive number
   * @param to message would broadcast to this node's children. default is "root/"
   */
    broadcast(message, volume = 0,to = 'root/') {
        if (volume > 0) {
            const wildcardPath = Array(volume).fill('*').join('/');
            this.eventStream.emit(to + wildcardPath, message);
        } else {
            this.eventStream.emit('**', message);
        }
    }
    actorOf(Actor, name) {
        name = name || Actor.name;
        return this.getRoot().getInstance().context.actorOf(Actor, name);
    }
    getRoot() {
        return privateProperties.get(this);
    }
    get(token) {
        if(token === RootActor) {
            return this.getRoot();
        }
        return this.getRoot().getInstance().context.get(token);
    }
    stop(actorRef) {
        this.getRoot().getInstance().context.stop(actorRef);
    }
    /* release all listener, and clear rootActor's children */
    terminal() {
        this.eventStream.removeAllListeners();
        this.getRoot().getInstance().context.children.clear();
    }
}
class ActorRef {
    constructor(Actor, system, listeners, parents, path, name) {
        const actor = new Actor();
        this.actor = actor;
        this.Actor = Actor;
        const scheduler = new ActorScheduler(system.eventStream, path, listeners, actor);
        const context = new ActorContext(name, this, system, null, scheduler, parents, path);
        actor.context = context;
    }
    getInstance() {
        return this.actor;
    }
    getContext() {
        return this.actor.context;
    }
    tell(message, sender) {
        this.actor.context.sender = sender || null;
        this.actor.context.scheduler.callback(message);
    }
    ask(message, sender) {
        this.actor.context.sender = sender || null;
        const result = this.actor.context.scheduler.callback(message);
        if (result && result.then) {
            return result;
        }

        throw TypeError(`Please use ".answer" to catch ${Object.getPrototypeOf(message).constructor.name}`);
    }
}
class ActorScheduler {
    constructor(eventStream, event, listeners, owner) {
        this.eventStream = eventStream;
        this.event = event;
        this.listeners = listeners;
        this.owner = owner;
        this.callback = (value) => {
            const listener = this.listeners.find(listener => !!listener.message && value instanceof listener.message);
            try {
                if (listener) {
                    if (listener.type === 'ask') {
                        const callback = listener.callback;
                        return new Promise((resolve, reject) => {
                            callback(resolve, reject)(value);
                        });
                    }
                    const callback = listener.callback;
                    callback(value);
                }
                // else if (this.defaultListener) {
                //     const callback = this.defaultListener.callback;
                //     callback(value);
                // }
            } catch (e) {
                this.owner.postError(e);
            }
        };
        this.defaultListener = this.listeners.find(listener => !listener.message);
    }
    getListeners() {
        return this.listeners;
    }
    cancel() {
        this.eventStream.off(this.event, this.callback);
        // this.eventStream.unbindAll(this.callback);
        return true;
    }
    isCancelled() {
        return !this.eventStream.listeners(this.event).length;
    }
    pause() {
        this.cancel();
    }
    restart() {
        this.cancel();
        this.start();
    }
    start() {
        // this.eventStream.addListener(this.event, this.callback);
        // this.eventStream.all(this.callback);
        this.eventStream.on(this.event, this.callback);
        this.defaultListener && this.eventStream.all(this.defaultListener.callback);
    }
    replaceListeners(listeners) {
        this.listeners = listeners;
        this.defaultListener = this.listeners.find(listener => !listener.message);
    }
}
class ActorContext {
    constructor(name, self, system, sender, scheduler, parents, path) {
        this.name = name;
        this.self = self;
        this.system = system;
        this.sender = sender;
        this.scheduler = scheduler;
        this.parents = parents;
        this.path = path;
        this.children = new Map();
    }
    actorOf(Actor, name) {
        name = name || Actor.name;
        const actorParents = [...this.parents,this.getActor()];
        const actorRef = new ActorRef(Actor, this.system, [], actorParents, this.path + '/' + name, name);
        //依赖关系表--{DetailActor: [root,detailactor]}
        this.system.actorRelation.set(Actor,[...actorParents,Actor]);
        this.children.set(Actor, actorRef);
        actorRef.getInstance().receive(); //schedule listen
        return actorRef;
    }
    getActor() {
        return this.self.Actor;
    }
    child(token) {
        return this.children.get(token);
    }
    parent() {
        const parent = this.parents[this.parents.length - 1];
        const parentref = this.system.get(parent);
        return parentref;
    }
    get(token) {
        //通过system中的actorRelation获取依赖关系表
        const curActor = this.getActor();
        const relations = this.system.actorRelation.get(token);
        const indexOfCurrent = relations.indexOf(curActor);
        return relations.slice(indexOfCurrent).reduce((acc,Actor) => {
            if(acc === curActor) {
                return this.child(Actor);
            }
            return acc.getInstance().context.child(Actor);
        });
    }
    /** stop self from parent, elsewise try to stop child
   *  stop should remove listener and delete the referece at children map.
   *  this is a recursive operation, so give an accurate parent to stop
   *  is match better than system.stop()
   *  @param actorRef
   */
    stop(actorRef = this.self) {
        const context = actorRef.getInstance().context;
        if (this.self.getInstance().context.path === context.path) {
            const parent = this.parents[this.parents.length - 1];
            const parentref = this.system.get(parent);
            parentref && parentref.getInstance().context.stop(actorRef);
        } else {
            const contextActor = context.getActor();
            const child = this.child(contextActor);
            const sdu = child.getInstance().context.scheduler;
            sdu.cancel();
            child.getInstance().postStop();
            for (const grandchild of child.getInstance().context.children.values()) {
                grandchild.getInstance().context.stop();
            }
            this.children.delete(contextActor);
        }
    }
    /**
   * change the Actor's behavior to become the new "Receive" handler.
   * @param behavior
   */
    become(behavior) {
        this.scheduler.cancel();
        const listeners = behavior.listeners;
        this.scheduler.replaceListeners(listeners);
        this.scheduler.start();
    }
    isAlive() {
        return this.scheduler ? !this.scheduler.isCancelled() : false;
    }
}
class AbstractActor {
    getSelf() {
        return this.context.self;
    }
    getSender() {
        return this.context.sender;
    }
    receiveBuilder() {
        return ActorReceiveBuilder.create();
    }
    receive() {
        const listeners = this.createReceive().listeners;
        this.context.scheduler.replaceListeners(listeners);
        this.context.scheduler.start();
        this.preStart();
    }
    /** is called when actor is started*/
    preStart() {
    }
    /** is called after getContext().stop() is invoked */
    postStop() {
    }
    /** is called after Receive got error */
    postError(err) {
        //TODO:
        console.log(err);
        // throw err;
    }
}
class RootActor extends AbstractActor {
    createReceive() {
        return this.receiveBuilder().build();
    }
}
class ActorReceiveBuilder {
    constructor() {
        this.listeners = [];
    }
    static create() {
        return new ActorReceiveBuilder();
    }
    match(message, callback) {
        if (Array.isArray(message)) {
            message.forEach(message => this.listeners.push({ message, type: 'tell', callback }));
        } else {
            this.listeners.push({ message, type: 'tell', callback });
        }
        return this;
    }
    answer(message, callback) {
        this.listeners.push({ message, type: 'ask', callback });
        return this;
    }
    matchAny(callback) {
        this.listeners.push({ type: 'tell', callback });
        return this;
    }
    build() {
        return new ActorReceive(this.listeners);
    }
}
class ActorReceive {
    constructor(listeners) {
        this.listeners = listeners;
    }
}

//store
export class Store extends AbstractActor {
    state = {}
    listeners = []
    subscribe(listener) {
        if(typeof listener !== 'function') {
            throw new Error('excepted listener to be a function');
        }
        this.listeners.push(listener);
        let isSubscribed = true;
        // return function unsubscribe() {
        //     if(!isSubscribed) {
        //         return;
        //     }
        //     isSubscribed = false;
        //     const index = this.listeners.indexOf(listener);
        //     this.listeners.splice(index,1);
        // };
        return {
            unsubscribe: () => {
                if(!isSubscribed) {
                    return;
                }
                isSubscribed = false;
                const index = this.listeners.indexOf(listener);
                this.listeners.splice(index,1);
            }
        };
    }
    setState(state) {
        this.state = {
            ...this.state,
            ...state
        };
        this.listeners.forEach((listener) => {
            listener(this.state);
        });
    }
}
export class System extends ActorSystem {
    // constructor(name) {
    //     super(name);
    // }
    dispatch(...args) {
        this.broadcast(...args);
    }
}

export function ActionCreator(name) {
    const fn = new Function('data','this.data = data');
    // fn.name = name;
    Object.defineProperty(fn,'name',{
        writable: true,
        configurable: true,
        enumerable: true,
        value: name
    });
    return fn;
}
