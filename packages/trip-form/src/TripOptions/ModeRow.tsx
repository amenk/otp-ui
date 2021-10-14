import coreUtils from "@opentripplanner/core-utils";
import React, { useEffect, useRef } from "react";

import {
  categoryIsActive,
  getCategoryPrimaryMode,
  getSelectedModes,
  isServerEnv
} from "./util";
import { Modes, QueryParams } from "./types";
import * as S from "./styled";

import Checkbox from "./Checkbox";

const ModeRow = ({
  onQueryParamChange,
  queryParams,
  queryParamOverrides,
  supportedModes,
  SimpleModeIcon
}: {
  onQueryParamChange(paramsToUpdate: QueryParams, categoryId?: string): void;
  queryParams: QueryParams;
  queryParamOverrides: { [key: string]: QueryParams };
  supportedModes: Modes;
  SimpleModeIcon?: React.FunctionComponent<{ mode: string }>;
}): React.ReactElement => {
  const { categories } = supportedModes;
  const selectedModes = getSelectedModes(queryParams);
  const selectedTransit = selectedModes.filter(coreUtils.itinerary.isTransit);
  const hasTransit = selectedTransit.length > 0;
  const selectedTransitString = selectedTransit.join(",") || "TRANSIT";

  // Scroll to active mode on initial render
  // This ref is attached to every active mode checkbox
  const initialRenderRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    // Non-DOM environments don't support scrollIntoView
    if (!isServerEnv) {
      initialRenderRef?.current?.scrollIntoView({
        behavior: "auto",
        // Ideally there is no vertical scrolling, but if this likely non-effective
        // scrolling is acceptable, then it is simpler
        block: "end",
        inline: "center"
      });
    }
  }, []);

  return (
    /* Not hiding the scrollbars here ensures the user can still scroll. Scrollbars are hidden using CSS. */
    <S.ScrollableRow hideScrollbars={false}>
      <Checkbox
        aria-checked={hasTransit}
        ariaLabel="Go by Transit"
        checked={hasTransit}
        // Prettier conflicts with jsx style rules
        // eslint-disable-next-line prettier/prettier
        onClick={() => onQueryParamChange({ companies: "", mode: `${selectedTransitString},WALK` })}
        selected={hasTransit}
        SimpleModeIcon={SimpleModeIcon}
      >
        Go by Transit
      </Checkbox>
      {categories.map(category => {
        const selectedModeAndCategoryActive = categoryIsActive(
          category,
          selectedModes
        );
        const isChecked = hasTransit
          ? category.type === "access" && selectedModeAndCategoryActive
          : category.type === "exclusive" && selectedModeAndCategoryActive;

        const onChangeMode = () => {
          // Use override query if present
          if (queryParamOverrides && queryParamOverrides[category.id]) {
            const override = queryParamOverrides[category.id];
            // Ensure exclusive modes that share IDs with non-exclusive modes don't have transit
            if (category.type === "exclusive") {
              override.mode = override.mode?.replace("TRANSIT,", "");
            }
            // Ensure access modes that share IDs with exclusive modes include transit
            if (
              category.type !== "exclusive" &&
              !override.mode?.includes("TRANSIT")
            ) {
              override.mode = `TRANSIT,${override.mode}`;
            }

            onQueryParamChange(override, category.id);
            return;
          }

          let mode = getCategoryPrimaryMode(category);
          const companies =
            typeof category.mode === "undefined"
              ? ""
              : category.options?.map(o => o.company).join(",") || "";
          if (category.type === "access") {
            mode = isChecked
              ? selectedTransitString
              : `${selectedTransitString},${mode}`;
          }
          onQueryParamChange({ companies, mode }, category.id);
        };
        // All Tri-Met categories either have a mode or the first option does
        const mode =
          category.mode || (category.options && category.options[0].mode);
        return (
          <Checkbox
            aria-checked={hasTransit}
            ariaLabel={category.label}
            checked={isChecked}
            key={`access-${category.label}`}
            mode={mode}
            onClick={onChangeMode}
            innerRef={isChecked ? initialRenderRef : null}
            selected={isChecked}
            SimpleModeIcon={SimpleModeIcon}
          >
            {category.label}
          </Checkbox>
        );
      })}
    </S.ScrollableRow>
  );
};

export default ModeRow;
