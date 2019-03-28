export function makeSlideTranslation(translationType, fromValue, toValue) {
    return {
        from: {
            [translationType]: fromValue,
        },
        to: {
            [translationType]: toValue,
        },
    };
}
