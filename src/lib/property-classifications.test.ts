import { describe, expect, it } from "vitest";
import { classificationAssignmentsValid, resolvePropertyClassifications } from "./property-classifications";
import { browseProperties, EMPTY_PROPERTY_FILTERS } from "./property-browsing";

const options = [{id:"city",kind:"city",label:"أبها"},{id:"type",kind:"type",label:"صناعي"},{id:"purpose",kind:"purpose",label:"استثمار"}];
const listing = {id:"listing",title:"شقة للبيع",category:"شقق",subcategory:"",location:"الرياض",price:"300000",created_at:"2026-10-20",city_id:"city",property_type_id:"type",purpose_id:"purpose"};
describe("owner-managed property classifications", () => {
  it("matches an assigned property to all three customer choices even when its title differs", () => {
    const resolved = resolvePropertyClassifications(listing, options);
    expect(browseProperties([resolved], {...EMPTY_PROPERTY_FILTERS,city:"أبها",type:"صناعي",purpose:"استثمار"}).map((item) => item.id)).toEqual(["listing"]);
    expect(browseProperties([resolved], {...EMPTY_PROPERTY_FILTERS,type:"سكني"})).toEqual([]);
  });
  it("renaming a category preserves its property assignments", () => {
    expect(resolvePropertyClassifications(listing, options.map((option) => option.id === "city" ? {...option,label:"تبوك"} : option)).city).toBe("تبوك");
  });
  it("requires a matching classification kind for each property field", () => {
    expect(classificationAssignmentsValid(listing, options)).toBe(true);
    expect(classificationAssignmentsValid({...listing, city_id:"type"}, options)).toBe(false);
    expect(classificationAssignmentsValid({...listing, purpose_id:null}, options)).toBe(false);
  });
  it("preserves legacy property inference when no assignment is recorded", () => {
    const resolved = resolvePropertyClassifications({...listing,city_id:null,property_type_id:null,purpose_id:null}, options);
    expect([resolved.city,resolved.property_type,resolved.purpose]).toEqual(["الرياض","سكني","بيع"]);
  });
});