
export const getTextWithAnchors = (text: string) => {
    let matches = text.match(/[A-zА-я0-9\._\-:/]+::[A-zА-я0-9]+[\$]?/igm) || []
    const anchors = matches.map(item => ({ original: item, link: item.split('::')[0], text: item.split('::')[1] }))

    anchors.forEach(anchor => text = text.replace(
        anchor.original,
        `<a href="${anchor.link}" target="_blank" rel="noreferrer">${ anchor.text }</a>`)
    )
    return text
}

export const getTextExcerpt = (text: string, length: number) => {
    let excerpt = text.slice(0, length)
    if (excerpt.length < text.length) {
        excerpt += '...'
    }
    return excerpt
}