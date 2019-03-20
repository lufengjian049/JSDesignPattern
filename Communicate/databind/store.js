const connectionStore = new WeakMap()
const ITERATION_KEY = Symbol('iteration key')

export function storeObservable (obj) {
  // this will be used to save (obj.key -> reaction) connections later
  connectionStore.set(obj, new Map())
}

export function registerReactionForOperation (reaction, { target, key, type }) {
  if (type === 'iterate') {
    key = ITERATION_KEY
  }

  const reactionsForObj = connectionStore.get(target)
  let reactionsForKey = reactionsForObj.get(key)
  if (!reactionsForKey) {
    reactionsForKey = new Set()
    reactionsForObj.set(key, reactionsForKey)
  }
  // save the fact that the key is used by the reaction during its current run
  if (!reactionsForKey.has(reaction)) {
    reactionsForKey.add(reaction)
    reaction.cleaners.push(reactionsForKey)
  }
}

export function getReactionsForOperation ({ target, key, type }) {
  const reactionsForTarget = connectionStore.get(target)
  const reactionsForKey = new Set()

  if (type === 'clear') {
    //Map forEach
    reactionsForTarget.forEach((_, key) => {
      addReactionsForKey(reactionsForKey, reactionsForTarget, key)
    })
  } else {
    addReactionsForKey(reactionsForKey, reactionsForTarget, key)
  }

  if (type === 'add' || type === 'delete' || type === 'clear') {
    const iterationKey = Array.isArray(target) ? 'length' : ITERATION_KEY
    addReactionsForKey(reactionsForKey, reactionsForTarget, iterationKey)
  }

  return reactionsForKey
}

function addReactionsForKey (reactionsForKey, reactionsForTarget, key) {
  const reactions = reactionsForTarget.get(key)
  reactions && reactions.forEach(reactionsForKey.add, reactionsForKey)
}
//reactionsForKey key Set [reaction1,reaction2...]
//clearns [Set1,Set2,Set3...] 在Set中包含了当前的reaction，分在各个key的set里面 
export function releaseReaction (reaction) {
  if (reaction.cleaners) {
    reaction.cleaners.forEach(releaseReactionKeyConnection, reaction)
  }
  reaction.cleaners = []
}

function releaseReactionKeyConnection (reactionsForKey) {
  reactionsForKey.delete(this)
}
