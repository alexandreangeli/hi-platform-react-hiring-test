import "./index.css";

function Selector({ selectorObject, toggleActive, toggleOpened }) {
  return (
    <div
      className={`
        selector 
        ${!!selectorObject.active ? "selector--active" : ""} 
        ${!!selectorObject.opened ? "selector--opened" : ""}
        ${!!selectorObject.indeterminate ? "selector--indeterminate" : ""}
      `}
    >
      <div
        className="selector__header"
        style={{ paddingLeft: selectorObject.level * 25 + "px" }}
      >
        <div
          className="selector__header__left"
          onClick={() => toggleActive(selectorObject)}
        >
          <div className="selector__header__left__checkbox">
            <input
              className="selector__header__left__checkbox-input"
              type="checkbox"
              readOnly
              checked={selectorObject.active}
            ></input>
            <label className="selector__header__left__checkbox-label"></label>
          </div>
          <div className="selector__header__left__title">
            {selectorObject.name}
          </div>
        </div>
        {!!Object.keys(selectorObject.children).length && (
          <div
            className="selector__header__right"
            onClick={() => toggleOpened(selectorObject)}
          >
            <div className="selector__header__right__arrow"></div>
          </div>
        )}
      </div>

      <div className="selector__body">
        {selectorObject.children.map((child) => (
          <Selector
            key={child.id}
            selectorObject={child}
            toggleActive={toggleActive}
            toggleOpened={toggleOpened}
          />
        ))}
      </div>
    </div>
  );
}

export default Selector;
