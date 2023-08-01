const getIdFromName = (name) => {
    return `${name.toLowerCase().split(' ').join('-')}`
}

export default getIdFromName