import
{
    animate,
    query,
    sequence,
    stagger,
    state,
    style,
    transition,
    trigger
} from "@angular/animations";

export const DropDownAnimation = trigger('dropDownMenu', [
    // ...
    state('closed', style({
        transform: 'translateY(-110%)',
        visibility: 'hidden'
    })),
    state('open', style({
        transform: 'translateY(0%)',
        visibility: 'visible'
    })),
    transition('open <=> closed', [
        animate('0.4s')
    ]),
]);