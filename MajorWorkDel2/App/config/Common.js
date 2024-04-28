export const generateRandomString = (length = 30) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
