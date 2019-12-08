import cn from '../cn'

describe('cn', () => {
    it('returns undefined for empty classes', () => {
        const result = cn``
        expect(result).toBeUndefined()
    })

    it('returns undefined for conditionally empty classes', () => {
        const result = cn`${false} foo ${false} bar`
        expect(result).toBeUndefined()
    })

    it('includes conditional classes', () => {
        const result = cn`${true} foo  ${true} bar`
        expect(result).toBe('foo bar')
    })

    it('handles mixed conditions', () => {
        const result = cn`${true} foo ${false}omit  ${true} bar`
        expect(result).toBe('foo bar')
    })

    it('includes optional classes (+syntax)', () => {
        const result = cn`${'foo'} +bar`
        expect(result).toBe('foo bar')
    })

    it('includes optional classes at the ending position (+syntax)', () => {
        const result = cn`bar${'foo'} +`
        expect(result).toBe('bar foo')
    })

    it('ignores extra insertion points (+syntax)', () => {
        const result = cn`${'foo'} bar + zoo + goo +`
        expect(result).toBe('bar foo zoo goo')
    })

    it('removes + for empty optional (+syntax)', () => {
        const result = cn`${undefined} +bar`
        expect(result).toBe('bar')
    })

    it('strips extra white spaces', () => {
        const result = cn`
            foo  ${true}   bar
        `
        expect(result).toBe('foo bar')
    })

    it('kitchen sink', () => {
        const result = cn`
            one  ${true}
            two
            ${false} three
            ${'five'} four +
            ${undefined} six +
        `
        expect(result).toBe('one two four five six')
    })
})
