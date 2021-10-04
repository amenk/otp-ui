import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import PropTypes from "prop-types";
import React from "react";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { Briefcase } from "@styled-icons/fa-solid/Briefcase";
import { Home } from "@styled-icons/fa-solid/Home";
import { MapMarker } from "@styled-icons/fa-solid/MapMarker";
import { MapPin } from "@styled-icons/fa-solid/MapPin";

import * as S from "./styled";

export function GeocodedOptionIcon(props) {
  const { feature } = props;
  const { properties } = feature;
  if (feature && properties) {
    const { source } = properties;
    if (source === "transit") {
      return <Bus size={13} />;
    }
  }
  return <MapPin size={13} />;
}
GeocodedOptionIcon.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.shape({ source: PropTypes.string })
  })
};
GeocodedOptionIcon.defaultProps = {
  feature: {}
};

export function Option({
  color,
  disabled,
  icon,
  isActive,
  onClick,
  title,
  classes
}) {
  return (
    <S.MenuItem onClick={onClick} active={isActive} disabled={disabled}>
      {coreUtils.ui.isIE() ? (
        // In internet explorer 11, some really weird stuff is happening where it
        // is not possible to click the text of the title, but if you click just
        // above it, then it works. So, if using IE 11, just return the title text
        // and avoid all the extra fancy stuff.
        // See https://github.com/ibi-group/trimet-mod-otp/issues/237
        title
      ) : (
        <S.OptionContainer className={classes}>
          <S.OptionIconContainer style={{ color }}>
            {icon}
          </S.OptionIconContainer>
          <S.OptionContent>{title}</S.OptionContent>
        </S.OptionContainer>
      )}
    </S.MenuItem>
  );
}

Option.propTypes = {
  /**
   * String of classes to apply to container.
   */
  classes: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.node
};

Option.defaultProps = {
  classes: "",
  color: null,
  disabled: false,
  icon: null,
  isActive: false,
  title: null
};

export function TransitStopOption({ isActive, onClick, stop, stopOptionIcon }) {
  return (
    <S.MenuItem onClick={onClick} active={isActive}>
      <S.StopIconAndDistanceContainer>
        {stopOptionIcon}
        <S.StopDistance>
          {humanizeDistanceStringImperial(stop.dist, true)}
        </S.StopDistance>
      </S.StopIconAndDistanceContainer>
      <S.StopContentContainer>
        <S.StopName>
          {stop.name} ({stop.code})
        </S.StopName>
        <S.StopRoutes>
          {(stop.routes || []).map(route => {
            const name = route.shortName || route.longName;
            return <S.RouteName key={`route-${name}`}>{name}</S.RouteName>;
          })}
        </S.StopRoutes>
      </S.StopContentContainer>
      <S.ClearBoth />
    </S.MenuItem>
  );
}

TransitStopOption.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  stop: coreUtils.types.transitIndexStopWithRoutes.isRequired,
  stopOptionIcon: PropTypes.node.isRequired
};

TransitStopOption.defaultProps = {
  isActive: false
};

export function UserLocationIcon({ userLocation }) {
  if (userLocation.icon === "work") return <Briefcase size={13} />;
  if (userLocation.icon === "home") return <Home size={13} />;
  return <MapMarker size={13} />;
}

UserLocationIcon.propTypes = {
  userLocation: coreUtils.types.userLocationType.isRequired
};
