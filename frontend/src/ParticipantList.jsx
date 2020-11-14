import React from "react";
import PropTypes from "prop-types";
import Participant from "./Participant";


function ParticipantList({ participants, streams }) {
  return (
    <div >
      {Object.keys(participants).map(participantId => (
        <Participant
          key={participantId}
          stream={streams[participantId] || null}
        />
      ))}
    </div>
  );
}

ParticipantList.propTypes = {
  participants: PropTypes.object.isRequired,
  streams: PropTypes.object.isRequired
};

export default ParticipantList;
