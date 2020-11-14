import React, { useRef } from "react";
import PropTypes from "prop-types";

function RoomForm({ onJoin, ...props }) {
    const handleFormSubmit = (event) => {
        event.preventDefault();
        onJoin(Math.floor(Math.random() * 100));
    };

    return (
        <form {...props} onSubmit={handleFormSubmit}>
            <button type="submit" className="btn btn-primary">
                Join
            </button>
        </form>
    );
}

RoomForm.propTypes = {
    onJoin: PropTypes.func.isRequired,
};

export default RoomForm;
