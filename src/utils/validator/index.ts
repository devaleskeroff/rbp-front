interface ObjectResponse {
    [key: string]: string | null
}

class Validator {
    value: string = ''
    alert: Array<string> | ObjectResponse = {}
    errName: string = ''
    multiple: boolean = false
    mainMessage: string | null = null

    constructor(
        value: string,
        errName: string,
        multipleMessages: boolean = false
    ) {
        this.value = value
        this.errName = errName
        this.multiple = multipleMessages
        this.alert = multipleMessages ? [] as Array<string> : { [errName]: null } as ObjectResponse
    }

    isEmail(message?: string): this {
        const regExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regExp.test(String(this.value).toLowerCase())) {
            this.addError(message, `Invalid email`)
        }
        return this
    }

    isRequired(message?: string): this {
        if (String(this.value).length < 1) {
            this.addError(message, `The field is required`)
        }
        return this
    }

    isLength({ min, max }: { min?: number, max?: number }, message?: string): this {
        let error
        if (min) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.value.length < min ? error = true : null
        }
        if (max) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.value.length > max ? error = true : null
        }
        if (error) {
            this.addError(message, `The field must contain at least ${min} ${max ? 'and at most '+max : ''} characters`)
        }
        return this
    }

    isValidString(message?: string): this {
        const regExp: RegExp = /[~`!#$%\^&*+=\-\[\]\\';,/{}()|\\":<>\?]/g
        if (regExp.test(this.value)) {
            this.addError(message, 'Invalid string')
        }
        return this
    }

    isUrl(message?: string): this {
        const regExp: RegExp = /([a-z]+:\/\/)?(w{3}\.)?([a-z]+)(\.[a-z]+\/?)/i
        if (!regExp.test(this.value)) {
            this.addError(message, 'Invalid url')
        }
        return this
    }

    isSame(secondValue: string, message?: string): this {
        if (this.value !== secondValue) {
            this.addError(message, 'Fields don`t match')
        }
        return this
    }

    isRunumeric(message?: string): string {
        const regExp: RegExp = /^([0-9]*[а-яА-Я]*)$/ig
        if (!regExp.test(this.value)) {
            return 'Please, enter russian alphanumeric only'
        }
        return 'Correct'
    }

    isAlphanumeric(message?: string): string {
        const regExp: RegExp = /^([0-9]*[A-z]*)$/ig
        if (!regExp.test(this.value)) {
            return 'Please, enter alphanumeric only'
        }
        return 'Correct'
    }

    isNumber(message?: string): this {
        const RegExp: RegExp = /^\d+$/
        if (!RegExp.test(this.value)) {
            this.addError(message, 'The field must be a number')
        }
        return this
    }

    isEqual(value: string | number, message?: string): this {
        const regExp = new RegExp(`^${value}$`)
        if (!regExp.test(this.value)) {
            this.addError(message, `The field must be equal to ${value}`)
        }
        return this
    }

    isEqualOneOf(values: string[] | number[], message?: string): this {
        let isEqual = false

        values.forEach(value => {
            const regExp = new RegExp(`^${value}$`)
            if (regExp.test(this.value)) {
                return isEqual = true
            }
        })

        if (!isEqual) {
            this.addError(message, `The field must be equal to one of these ${values.join(', ')}`)
        }

        return this
    }

    isBetween({ min, max }: { min: number, max: number }, message?: string): this {
        try {
            const number = Number(this.value)

            if (number < min || number > max) {
                this.addError(message, `The field must be between ${min} and ${max}`)
            }
        } catch (err) {
            this.addError(message, 'The field must be a number')
        }
        return this
    }

    isGreater(num: number, message?: string): this {
        try {
            const number = Number(this.value)

            if (number <= num) {
                this.addError(message, `The field must be greater then ${num}`)
            }
        } catch (err) {
            this.addError(message, 'The field must be a number')
        }
        return this
    }

    isLess(num: number, message?: string): this {
        try {
            const number = Number(this.value)

            if (number >= num) {
                this.addError(message, `The field must be less then ${num}`)
            }
        } catch (err) {
            this.addError(message, 'The field must be a number')
        }
        return this
    }

    isFloat(message?: string): this {
        const RegExp: RegExp = /^\d+\.\d+$/
        if (!RegExp.test(this.value)) {
            this.addError(message, 'The field must be a float')
        }
        return this
    }

    isInteger(message?: string): this {
        const RegExp: RegExp = /^\d+$/
        if (!RegExp.test(this.value)) {
            this.addError(message, 'The field must be an integer')
        }
        return this
    }

    isPhoneNumber(message?: string): this {
        const regExp: RegExp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)(\d{1,3}([\- ])?){7,12}$/
        if (!regExp.test(this.value)) {
            this.addError(message, 'Invalid phone number')
        }
        return this
    }

    isDate(message?: string): this {
        const newDate = new Date(this.value)
        if (String(newDate).match(/invalid/ig)) {
            this.addError(message, 'Invalid date')
        }
        return this
    }

    isEarlier(DateInMs: number, message?: string): this {
        try {
            const date = new Date(this.value).getTime()
            const currentDate = Date.now()

            if (currentDate - date > DateInMs) {
                this.addError(message, 'The specified date must be earlier')
            }

        } catch (err) {
            this.addError(message, 'Invalid date')
        }
        return this
    }

    isLater(DateInMs: number, message?: string): this {
        try {
            const date = new Date(this.value).getTime()
            const currentDate = Date.now()

            if (currentDate - date < DateInMs) {
                this.addError(message, 'The specified date must be later')
            }

        } catch (err) {
            this.addError(message, 'Invalid date')
        }
        return this
    }

    withMessage(message: string): this {
        this.mainMessage = message

        if (this.multiple && this.alert instanceof Array) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.alert.length > 0 ? this.addError() : null
        } else {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.alert[this.errName] ? this.addError() : null
        }
        return this
    }

    addError(customMessage?: string, defaultMessage?: string): void {
        if (this.mainMessage) {
            // @ts-ignore
            this.multiple ? this.alert = [this.mainMessage] : this.alert[this.errName] = this.mainMessage
        } else if (this.multiple && this.alert instanceof Array && defaultMessage) {
            customMessage ? this.alert.push(customMessage) : this.alert.push(defaultMessage)
        } else {
            // @ts-ignore
            return customMessage ? this.alert[this.errName] = customMessage : this.alert[this.errName] = defaultMessage
        }
    }

    normalizeEmail() {
        this.value = this.value.trim().toLowerCase()
        return this
    }

    trim() {
        this.value = this.value.trim()
        return this
    }

    toCapitalized() {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        return this
    }

    getValue(): string {
        return this.value
    }

    getErrors(): Array<string> | ObjectResponse {
        return this.alert
    }

    static hasError(validatedData: Array<any> | ObjectResponse): boolean {
        if (validatedData instanceof Array) {
            if (validatedData.length > 0) return true
        } else {
            for (let key in validatedData as ObjectResponse) {
                if (validatedData[key]) {
                    return true
                }
            }
        }
        return false
    }
}

function getValidator(value: string, errorName?: string, multipleMessages: boolean = false): Validator {
    if (!errorName) {
        multipleMessages = true
    }
    let errName = errorName ? errorName + 'Error' : 'error'
    return new Validator(value || '', errName, multipleMessages)
}

getValidator.hasError = Validator.hasError as (errors: Array<any> | ObjectResponse) => boolean

export default getValidator
