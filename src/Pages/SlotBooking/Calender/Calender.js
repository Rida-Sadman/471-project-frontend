import React, { useState } from "react";
import { DayPicker } from "react-day-picker";

const Calender = ({ currentDate, HandleChangeDate, disabledDaysCalender }) => {
  return (
    <div>
      <input type="checkbox" id="calender-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor="calender-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={currentDate}
              onSelect={HandleChangeDate}
              disabled={disabledDaysCalender}
              disableNavigation
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calender;
