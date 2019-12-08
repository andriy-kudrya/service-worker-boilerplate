const cn = (classes: TemplateStringsArray, ...conditions: (boolean | string | null | undefined)[]) =>
        classes
            .reduce(
                (acc, value, idx) => {
                    const condition = conditions[idx - 1]
                        , hasNoInsertion = !value.includes('+')

                    if (hasNoInsertion)
                        return condition ? acc + ' ' + value : acc

                    const values = value.split('+')
                    if (condition)
                        values.splice(1, 0, condition as any)

                    return acc + ' ' + values.join(' ')
                }
            )
            .replace(/\s{2,}/g, ' ')
            .trim() || undefined

export default cn

