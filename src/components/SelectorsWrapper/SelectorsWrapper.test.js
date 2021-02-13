import React from "react";
import SelectorsWrapper from "./index.js";
import { mount } from "enzyme";

let mockData = {
  0: {
    id: "8300a71a-db51-4fde-bd0a-4591aa2a4499",
    name: "Juan Ramón Severo",
    children: {
      0: {
        id: "14ee5eb2-b360-453c-ac09-0dd6ded5b935",
        name: "Ronald Isaac Bashevis",
        children: {
          0: {
            id: "2706b470-76d7-4ef3-96d0-93963327eca6",
            name: "Sir Frank Macfarlane Robert F.",
            children: {},
            level: 2,
          },
          1: {
            id: "d3865a91-c4e3-4ee7-b73e-5c2c7d428091",
            name: "Wladyslaw Stanislaw Ivar",
            children: {},
            level: 3,
          },
        },
        level: 1,
      },
      1: {
        id: "32c7aa98-619d-40bc-8861-75e8136c82ee",
        name: "Friedrich John Franklin",
        children: {},
        level: 1,
      },
    },
    level: 0,
  },
  1: {
    id: "e0d52ca9-4b39-42c2-8b2b-bbb8efa2e78d",
    name: "Paul Adrien Maurice Sir Arthur",
    children: {
      0: {
        id: "4de37406-3f6b-4766-a8ca-cce5e144204d",
        name: "John Cowdery William",
        children: {},
        level: 1,
      },
      1: {
        id: "7e87957b-cec2-41f4-923f-6ea7b311747a",
        name: "Eric A. John",
        children: {},
        level: 1,
      },
    },
    level: 0,
  },
};

let wrapper = mount(<SelectorsWrapper data={mockData} />);

beforeEach(() => {
  wrapper = mount(<SelectorsWrapper data={mockData} />);
});

test("renders all selectors in correct structure order and classes", () => {
  expect(wrapper.find(".selector--active").length).toBe(0);
  expect(wrapper.find(".selector--opened").length).toBe(0);
  expect(wrapper.find(".selector--indeterminate").length).toBe(0);
  expect(wrapper.find(".selector").at(0).find(".selector").length).toBe(5);
  expect(wrapper.find(".selector").at(1).find(".selector").length).toBe(3);
  expect(wrapper.find(".selector").at(2).find(".selector").length).toBe(1);
  expect(wrapper.find(".selector").at(3).find(".selector").length).toBe(1);
  expect(wrapper.find(".selector").at(4).find(".selector").length).toBe(1);
  expect(wrapper.find(".selector").at(5).find(".selector").length).toBe(3);
  expect(wrapper.find(".selector").at(6).find(".selector").length).toBe(1);
  expect(wrapper.find(".selector").at(7).find(".selector").length).toBe(1);
});

test("open and close first selector", () => {
  wrapper
    .find(".selector")
    .at(0)
    .find(".selector__header__right")
    .at(0)
    .simulate("click");

  expect(wrapper.find(".selector").at(0).getDOMNode()).toHaveClass(
    "selector--opened"
  );
  expect(wrapper.find(".selector--opened").length).toBe(1);

  wrapper
    .find(".selector")
    .at(0)
    .find(".selector__header__right")
    .at(0)
    .simulate("click");

  expect(wrapper.find(".selector--opened").length).toBe(0);
});

test("select and unselect first selector and all his children", () => {
  wrapper
    .find(".selector")
    .at(0)
    .find(".selector__header__left")
    .at(0)
    .simulate("click");

  expect(wrapper.find(".selector--active").length).toBe(5);
  expect(wrapper.find(".selector").at(0).getDOMNode()).toHaveClass(
    "selector--active"
  );
  expect(wrapper.find(".selector").at(1).getDOMNode()).toHaveClass(
    "selector--active"
  );
  expect(wrapper.find(".selector").at(2).getDOMNode()).toHaveClass(
    "selector--active"
  );
  expect(wrapper.find(".selector").at(3).getDOMNode()).toHaveClass(
    "selector--active"
  );
  expect(wrapper.find(".selector").at(4).getDOMNode()).toHaveClass(
    "selector--active"
  );

  wrapper
    .find(".selector")
    .at(0)
    .find(".selector__header__left")
    .at(0)
    .simulate("click");

  expect(wrapper.find(".selector--active").length).toBe(0);
});

test("set and unset indeterminate state to parents when toggling child", () => {
  wrapper
    .find(".selector")
    .at(0)
    .find(".selector__header__left")
    .at(0)
    .simulate("click");

  wrapper
    .find(".selector")
    .at(3)
    .find(".selector__header__left")
    .at(0)
    .simulate("click");

  expect(wrapper.find(".selector--indeterminate").length).toBe(2);
  expect(wrapper.find(".selector").at(0).getDOMNode()).toHaveClass(
    "selector--indeterminate"
  );
  expect(wrapper.find(".selector").at(1).getDOMNode()).toHaveClass(
    "selector--indeterminate"
  );

  wrapper
    .find(".selector")
    .at(3)
    .find(".selector__header__left")
    .at(0)
    .simulate("click");

  expect(wrapper.find(".selector--indeterminate").length).toBe(0);
});
