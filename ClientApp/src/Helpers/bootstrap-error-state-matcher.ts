import { FormControl, FormGroup, FormGroupDirective, NgForm } from "@angular/forms";

export class BootstrapErrorStateMatcher
{
    isErrorState(controlName: string, fromGroup: FormGroup, form: HTMLFormElement | NgForm | null): boolean
    {
        const isSubmitted = form && form.submitted;
        let c = fromGroup.get(controlName);
        return !!(c && c.invalid && (c.dirty || c.touched || isSubmitted));
    }
    isTouchedOrDirty(controlName: string, fromGroup: FormGroup): boolean
    {
        let c = fromGroup.get(controlName);
        return !!(c && (c.dirty || c.touched));
    }
}
