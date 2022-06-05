import { FormControl, FormGroup } from "@angular/forms";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockService } from "ng-mocks";
import { ClientSideValidationService } from "./client-side-validation.service";
import { NotificationsService } from "./notifications.service";

describe("ClientSideValidationService", () =>
{
    let spectator: SpectatorService<ClientSideValidationService>;
    let Notifications = MockService(NotificationsService);
    const createService = createServiceFactory({
        service: ClientSideValidationService,
        providers: [{ provide: NotificationsService, useValue: Notifications }],
        entryComponents: [],
        mocks: []
    });

    beforeEach(() => spectator = createService());

    it("refills form from object using refillForm()", () =>
    {
        let testForm: FormGroup = new FormGroup({
            prop1: new FormControl("prop 1 val"),
            prop2: new FormControl("Prop 2 val"),
            prop3: new FormControl("Prop 3 vale")
        });
        let testObj = {
            prop1: "Change prop 1 val",
            prop2: "Change prop 2 val",
            prop3: "Change prop 3 val",
        };
        spectator.service.refillForm(testObj, testForm);
        expect(testForm.get("prop1")?.value).toEqual(testObj.prop1);
        expect(testForm.get("prop2")?.value).toEqual(testObj.prop2);
        expect(testForm.get("prop3")?.value).toEqual(testObj.prop3);
    });
    describe("isUnique()", () =>
    {
        let arr: any[];
        beforeEach(() =>
        {
            arr = [
                { id: 1, name: "Name 1", age: "25", university: "Cairo" },
                { id: 2, name: "Name 2", age: "26", university: "Cairo1" },
                { id: 3, name: "Name 3", age: "27", university: "Cairo2" },
                { id: 4, name: "Name 4", age: "28", university: "Cairo3" },
            ];
        });
        it("returns [TRUE] if it is unique [without] adding id", () =>
        {
            expect(spectator.service.isNotUnique(arr, "name", "Name 5")).not.toBeFalse();
        });
        it("returns [FALSE] if it is not unique [without] adding id", () =>
        {
            expect(spectator.service.isNotUnique(arr, "name", "Name 4")).not.toBeTrue();
            expect(spectator.service.isNotUnique(arr, "age", "25")).not.toBeTrue();
            expect(spectator.service.isNotUnique(arr, "university", "Cairo")).not.toBeTrue();
        });
        it("returns [TRUE] if it is unique [With] adding id", () =>
        {
            expect(spectator.service.isNotUnique(arr, "name", "Name 4", 4)).not.toBeFalse();
        });
        it("returns [FALSE] if it is not unique [With] adding id", () =>
        {
            expect(spectator.service.isNotUnique(arr, "name", "Name 4", 5)).not.toBeTrue();
            expect(spectator.service.isNotUnique(arr, "age", "25", 5)).not.toBeTrue();
            expect(spectator.service.isNotUnique(arr, "university", "Cairo", 5)).not.toBeTrue();
        });
    });
    describe("isUniqueMany()", () =>
    {
        let arr: any[];
        beforeEach(() =>
        {
            arr = [
                { id: 1, name: "Name 1", age: "25", university: "Cairo" },
                { id: 2, name: "Name 2", age: "26", university: "Cairo1" },
                { id: 3, name: "Name 3", age: "27", university: "Cairo2" },
                { id: 4, name: "Name 4", age: "28", university: "Cairo3" },
            ];
        });
        it("returns [TRUE] if it is unique [without] adding id", () =>
        {
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 5" }, { key: "age", value: "50" }])).not.toBeFalse();
        });
        it("returns [FALSE] if it is not unique [without] adding id", () =>
        {
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 1" }, { key: "age", value: "50" }])).not.toBeTrue();
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 2" }, { key: "age", value: "200" }])).not.toBeTrue();
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 3" }, { key: "university", value: "fdfdfdf" }])).not.toBeTrue();
        });
        it("returns [TRUE] if it is unique [With] adding id", () =>
        {
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 5" }, { key: "age", value: "50" }], 4)).not.toBeFalse();
        });
        it("returns [FALSE] if it is not unique [With] adding id", () =>
        {
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 1" }, { key: "age", value: "50" }], 5)).not.toBeTrue();
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 2" }, { key: "age", value: "200" }], 5)).not.toBeTrue();
            expect(spectator.service.isUniqueMany(arr, [{ key: "name", value: "Name 3" }, { key: "university", value: "fdfdfdf" }], 5)).not.toBeTrue();
        });
    });
    describe("isEqual()", () =>
    {
        it("returns [true] if the 2 objects are equal", () =>
        {
            let ObjectToCompare = {
                id: 1,
                name: "Jhon",
                age: "25",
            };
            let ObjectToCompareWith = {
                id: 2,
                name: "Jhon",
                age: "25"
            };
            expect(spectator.service.isEqual(ObjectToCompare, ObjectToCompareWith)).toBeTrue();
        });
        it("returns [False] if the 2 objects are [not] equal", () =>
        {
            let ObjectToCompare = {
                name: "Jon",
                age: "25"
            };
            let ObjectToCompareWith = {
                name: "Jhon",
                age: "25"
            };
            expect(spectator.service.isEqual(ObjectToCompare, ObjectToCompareWith)).toBeFalse();
        });
    });
    describe("isUpdated()", () =>
    {
        it("returns [true] if the user updates the form", () =>
        {
            let testForm: FormGroup = new FormGroup({
                prop1: new FormControl(""),
                prop2: new FormControl("Prop 2 val"),
                prop3: new FormControl("Prop 3 vale")
            });
            let testObj = {
                prop1: "",
                prop2: "Prop 2 val",
                prop3: "Change prop 3 val",
            };
            expect(spectator.service.isUpdated(testObj, testForm)).toBeTrue();
        });
        it("returns [False] if the user doesn't update the form", () =>
        {
            let testForm: FormGroup = new FormGroup({
                prop1: new FormControl("prop 1 val"),
                prop2: new FormControl("Prop 2 val"),
                prop3: new FormControl("Prop 3 vale")
            });
            let testObj = {
                prop1: "prop 1 val",
                prop2: "Prop 2 val",
                prop3: "Prop 3 vale",
            };
            expect(spectator.service.isUpdated(testObj, testForm)).toBeFalse();
        });
    });
    describe("FillObjectFromForm()", () =>
    {
        it("Fills object from form", () =>
        {
            let testForm: FormGroup = new FormGroup({
                prop1: new FormControl("23"),
                prop2: new FormControl(false),
                prop3: new FormControl("Prop 3 vale"),
                prop4: new FormControl(undefined),
                prop5: new FormControl("بيبسيبسي")
            });
            interface temp
            {
                prop1: number;
                prop2: boolean;
                prop3: string;
                prop4: undefined;
                prop5: number;
            }
            let testObj: temp = {
                prop1: 0,
                prop2: true,
                prop3: "",
                prop4: undefined,
                prop5: 23
            };
            spectator.service.FillObjectFromForm(testObj, testForm);
            expect(testObj.prop1).toEqual(Number(testForm.get("prop1")?.value));
            expect(testObj.prop2).toEqual(testForm.get("prop2")?.value);
            expect(testObj.prop3).toEqual(testForm.get("prop3")?.value);
            expect(testObj.prop4).toEqual(testForm.get("prop4")?.value);
            expect(testObj.prop5).toEqual(0);
        });
    });
});