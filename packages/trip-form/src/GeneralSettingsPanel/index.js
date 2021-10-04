import coreUtils from "@opentripplanner/core-utils";
import React, { Component } from "react";
import PropTypes from "prop-types";

import CheckboxSelector from "../CheckboxSelector";
import DropdownSelector from "../DropdownSelector";
import * as Styled from "../styled";

/**
 * The general settings panel for setting speed and routing optimization controls.
 */
class GeneralSettingsPanel extends Component {
  handleChange = queryParam => {
    const { onQueryParamChange } = this.props;

    if (typeof onQueryParamChange === "function") {
      onQueryParamChange(queryParam);
    }
  };

  render() {
    const { className, paramNames, query, style, supportedModes } = this.props;
    const configWrapper = { modes: supportedModes };

    return (
      <Styled.GeneralSettingsPanel className={className} style={style}>
        {paramNames.map(param => {
          const paramInfo = coreUtils.queryParams.default.find(
            qp => qp.name === param
          );
          // Check that the parameter applies to the specified routingType
          if (!paramInfo.routingTypes.includes(query.routingType)) return null;

          // Check that the applicability test (if provided) is satisfied
          if (
            typeof paramInfo.applicable === "function" &&
            !paramInfo.applicable(query, configWrapper)
          ) {
            return null;
          }

          const label = coreUtils.query.getQueryParamProperty(
            paramInfo,
            "label",
            query
          );
          const icon = coreUtils.query.getQueryParamProperty(
            paramInfo,
            "icon",
            query
          );

          // Create the UI component based on the selector type
          switch (paramInfo.selector) {
            case "DROPDOWN":
              return (
                <DropdownSelector
                  key={paramInfo.name}
                  name={paramInfo.name}
                  value={query[paramInfo.name] || paramInfo.default}
                  label={label}
                  options={coreUtils.query.getQueryParamProperty(
                    paramInfo,
                    "options",
                    query
                  )}
                  onChange={this.handleChange}
                />
              );
            case "CHECKBOX":
              return (
                <CheckboxSelector
                  key={paramInfo.label}
                  name={paramInfo.name}
                  value={query[paramInfo.name]}
                  label={
                    <>
                      {icon}
                      {label}
                    </>
                  }
                  onChange={this.handleChange}
                />
              );
            default:
              return null;
          }
        })}
      </Styled.GeneralSettingsPanel>
    );
  }
}

GeneralSettingsPanel.propTypes = {
  /**
   * The CSS class name to apply to this element.
   */
  className: PropTypes.string,
  /**
   * An object {parameterName: value, ...} whose attributes correspond to query parameters.
   * For query parameter names and value formats,
   * see https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/__tests__/query.js#L14
   */
  // Disable type check because the only use of queryParams is to be passed to
  // method getQueryParamProperty from "@opentripplanner/core-utils/query".
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.any,
  /**
   * An array of parameter names to support in the settings panel.
   * See the `query` parameter for more on query parameter names.
   */
  paramNames: PropTypes.arrayOf(PropTypes.string),
  /**
   * Triggered when the value of a trip setting is changed by the user.
   * @param arg The data {name: value} of the changed trip setting.
   */
  onQueryParamChange: PropTypes.func,
  /**
   * An array of supported modes that will be displayed as options.
   */
  supportedModes: coreUtils.types.configuredModesType.isRequired
};

GeneralSettingsPanel.defaultProps = {
  className: null,
  query: null,
  paramNames: coreUtils.query.defaultParams,
  onQueryParamChange: null
};

export default GeneralSettingsPanel;
