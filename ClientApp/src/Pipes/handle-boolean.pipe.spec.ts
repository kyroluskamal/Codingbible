/* tslint:disable:no-unused-variable */

import { HandleBooleanPipe } from "./handle-boolean.pipe";


describe('Boolean pipe', () =>
{
    let pipe = new HandleBooleanPipe();
    it('transforms "true" to "Yes"', () =>
    {
        expect(pipe.transform(true, "Yes", "false")).toBe("Yes");
    });
    it('transforms "false" to "No"', () =>
    {
        expect(pipe.transform(false, "Yes", "No")).toBe("No");
    });
});
