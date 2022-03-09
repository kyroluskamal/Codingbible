import { FormGroup } from "@angular/forms";
import { Spectator, SpectatorRouting } from "@ngneat/spectator";

export function toTitleCase(str: string)
{
    return str.replace(
        /\w\S*/g,
        function (txt)
        {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        }
    );
}

export function spectatorSelectByControlName<T>(Spectator: Spectator<T> | SpectatorRouting<T>, controlName: string): HTMLElement | null
{
    return Spectator.query(`[ng-reflect-name="${controlName}"]`);
}
