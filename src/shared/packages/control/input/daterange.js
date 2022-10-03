import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css"
import PropTypes from "prop-types";

registerLocale('vi', vi)

const DateRangeInput = ({
    onChange,
    ...props
}) => {
    const [dateRange, setDateRange] = useState({
        startDate: props.startDate ?? new Date(),
        endDate: props.endDate ?? null
    });

    function handleDateChange(date) {
        let [start, end] = date;
        setDateRange({
            startDate: start,
            endDate: end
        })
        if (onChange) {
            onChange(date)
        }
    }

    const format = 'vi-VN'
    return <DatePicker
        locale="vi"
        selected={dateRange.startDate}
        value={!(dateRange?.startDate && dateRange?.endDate) ? '' : `${dateRange?.startDate?.toLocaleDateString('en-GB') || ''} - ${dateRange?.endDate?.toLocaleDateString('en-GB') || ''}`}
        className="form-control muiInputBase-input-custom"
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        selectsRange
        shouldCloseOnSelect={false}
        dropdownMode="scroll"
        showYearDropdown
        showMonthDropdown
        portalId={"picker-portal-id"}
        onChange={(date) => {
            handleDateChange(date)
        }}
        {...props}
    />
}

DateRangeInput.propTypes = {

};

DateRangeInput.defaultProps = {

};

export default DateRangeInput;
