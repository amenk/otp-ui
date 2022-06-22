import React from "react";
import { Stop } from "@opentripplanner/types";
import { MarkerWithPopup } from "../../base-map/lib";
import { LeafletStyleMarker } from "../../base-map/lib/styled";

export default function DefaultStopMarker({
  // leafletPath, TODO Re-add the path settings?
  radius = 9,
  stop
}: {
  radius: number;
  stop: Stop;
}): JSX.Element {
  return (
    <MarkerWithPopup
      position={[stop.lat, stop.lon]}
      key={stop.id}
      popupContents={<div>{stop.name}</div>}
    >
      <LeafletStyleMarker
        size={radius * 2}
        stroke={radius / 3}
        strokeColor="#333"
        color="#00FFFF"
      />
    </MarkerWithPopup>
  );
}
