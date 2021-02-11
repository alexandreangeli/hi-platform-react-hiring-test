import { useState } from "react";
import "./index.css";
import Selector from "../Selector";
import data from "../../data.json";

function SelectorsWrapper() {
  const [selectors, setSelectors] = useState(
    addActiveOpenedAndIndeterminateProperties(
      JSON.parse(localStorage.getItem("HI_PLATFORM_VUE_TEST_DATA")) || data
    )
  );

  function addActiveOpenedAndIndeterminateProperties(selectors) {
    for (let index in selectors) {
      if (!selectors[index].hasOwnProperty("active")) {
        selectors[index].active = false;
      }
      if (!selectors[index].hasOwnProperty("opened")) {
        selectors[index].opened = false;
      }
      if (!selectors[index].hasOwnProperty("indeterminate")) {
        selectors[index].indeterminate = false;
      }

      addActiveOpenedAndIndeterminateProperties(selectors[index].children);
    }
    return selectors;
  }

  function findSelectorAndParentByID(selectors, id) {
    for (let index in selectors) {
      if (selectors[index].id === id) {
        return {
          selector: selectors[index],
          parent: undefined,
        };
      } else {
        let selectorAndParent = findSelectorAndParentByID(
          selectors[index].children,
          id
        );
        if (selectorAndParent) {
          return {
            selector: selectorAndParent.selector,
            parent: selectorAndParent.parent || selectors[index],
          };
        }
      }
    }
  }

  function updateSelectorState(selector, selectors) {
    let childrenIndexes = Object.keys(selector.children);

    let hasUnselectedChildren = !!childrenIndexes.find(
      (i) => !selector.children[i].active || selector.children[i].indeterminate
    );
    let hasSelectedChildren = !!childrenIndexes.find(
      (i) => !!selector.children[i].active || selector.children[i].indeterminate
    );

    setActive(
      selector,
      selectors,
      !hasUnselectedChildren,
      hasUnselectedChildren && hasSelectedChildren
    );

    let { parent } = findSelectorAndParentByID(selectors, selector.id);
    if (!!parent) {
      updateSelectorState(parent, selectors);
    }
  }

  function setActive(selector, selectors, active, indeterminate) {
    selector.active = active;
    selector.indeterminate = indeterminate;

    if (!selector.indeterminate) {
      for (let index in selector.children) {
        if (
          (selector.active && !selector.children[index].active) ||
          (!selector.active && selector.children[index].active)
        ) {
          setActive(
            selector.children[index],
            selectors,
            !selector.children[index].active,
            false
          );
        }
      }
    }
  }

  function toggleActive(selectorObj) {
    let selectorsCopy = { ...selectors };

    let { selector, parent } = findSelectorAndParentByID(
      selectorsCopy,
      selectorObj.id
    );

    setActive(selector, selectorsCopy, !selectorObj.active, false);

    if (parent) {
      updateSelectorState(parent, selectorsCopy);
    }

    setSelectors(selectorsCopy);

    localStorage.setItem(
      "HI_PLATFORM_VUE_TEST_DATA",
      JSON.stringify(selectorsCopy)
    );
  }

  function toggleOpened(selectorObj) {
    let selectorsCopy = { ...selectors };
    let { selector } = findSelectorAndParentByID(selectorsCopy, selectorObj.id);
    selector.opened = !selector.opened;
    setSelectors(selectorsCopy);
  }

  return (
    <div className="selectors-wrapper">
      {Object.keys(selectors).map((index) => (
        <Selector
          selectorObject={selectors[index]}
          toggleActive={toggleActive}
          toggleOpened={toggleOpened}
          key={selectors[index].id}
        />
      ))}
    </div>
  );
}

export default SelectorsWrapper;
