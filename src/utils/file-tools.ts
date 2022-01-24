
export function _blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
}

export function _base64ToArrayBuffer(base64: string) {
    const binary_string = window.atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }

    return bytes.buffer
}