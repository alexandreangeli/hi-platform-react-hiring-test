import { useState, useEffect } from "react";
import "./index.css";
import Selector from "../Selector";

function SelectorsWrapper({ data }) {
  const [selectors, setSelectors] = useState([]);

  useEffect(() => {
    function turnObjectToArray(array, object) {
      for (let index in object) {
        let element = object[index];

        if (!element.hasOwnProperty("active")) {
          element.active = false;
        }
        if (!element.hasOwnProperty("opened")) {
          element.opened = false;
        }
        if (!element.hasOwnProperty("indeterminate")) {
          element.indeterminate = false;
        }
        if (!element.hasOwnProperty("idsTrace")) {
          element.idsTrace = [element.id];
        }

        let children = { ...element.children };
        element.children = [];
        for (let childIndex in children) {
          children[childIndex].idsTrace = [...element.idsTrace];
          children[childIndex].idsTrace.push(children[childIndex].id);
        }

        array.push(element);
        turnObjectToArray(element.children, children);
      }

      return array;
    }

    let array =
      JSON.parse(localStorage.getItem("HI_PLATFORM_VUE_TEST_DATA")) ||
      turnObjectToArray([], data);

    setSelectors(array);
  }, []);

  function findSelectorInSelectorsArray(idsTrace, selectors) {
    return idsTrace.reduce((sel, currentId) => {
      let parent = !!sel ? sel.selector : undefined;
      let selector = !!sel
        ? sel.selector.children.find((c) => c.id === currentId)
        : selectors.find((s) => s.id === currentId);

      return {
        selector,
        parent,
      };
    }, undefined);
  }

  function updateSelectorState(selector, selectors) {
    let hasUnselectedChildren = !!selector.children.find(
      (c) => !c.active || c.indeterminate
    );
    let hasSelectedChildren = !!selector.children.find(
      (c) => !!c.active || c.indeterminate
    );

    setActive(
      selector,
      selectors,
      !hasUnselectedChildren,
      hasUnselectedChildren && hasSelectedChildren
    );

    if (selector.idsTrace.length > 1) {
      let { parent } = findSelectorInSelectorsArray(
        selector.idsTrace,
        selectors
      );
      updateSelectorState(parent, selectors);
    }
  }

  function setActive(selector, selectors, active, indeterminate) {
    selector.active = active;
    selector.indeterminate = indeterminate;

    if (!selector.indeterminate) {
      for (let child of selector.children) {
        if (selector.active !== child.active) {
          setActive(child, selectors, !child.active, false);
        }
      }
    }
  }

  function toggleActive(selectorObj) {
    let selectorsCopy = [...selectors];
    let { selector, parent } = findSelectorInSelectorsArray(
      selectorObj.idsTrace,
      selectorsCopy
    );

    setActive(selector, selectorsCopy, !selectorObj.active, false);

    if (parent) {
      updateSelectorState(parent, selectorsCopy);
    }

    setSelectors(selectorsCopy);
    saveSelectorsInLocalStorage(selectorsCopy);
  }

  function saveSelectorsInLocalStorage(selectors) {
    localStorage.setItem(
      "HI_PLATFORM_VUE_TEST_DATA",
      JSON.stringify(selectors)
    );
  }

  function toggleOpened(selectorObj) {
    let selectorsCopy = [...selectors];
    let { selector } = findSelectorInSelectorsArray(
      selectorObj.idsTrace,
      selectorsCopy
    );
    selector.opened = !selector.opened;
    setSelectors(selectorsCopy);
    saveSelectorsInLocalStorage(selectorsCopy);
  }

  return (
    <div className="selectors-wrapper">
      {selectors.map((selector) => (
        <Selector
          key={selector.id}
          selectorObject={selector}
          toggleActive={toggleActive}
          toggleOpened={toggleOpened}
        />
      ))}
    </div>
  );
}

export default SelectorsWrapper;
