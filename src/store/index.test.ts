import * as index from "~store/index"
// @ponicode
describe("index.configureStore", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.configureStore(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
