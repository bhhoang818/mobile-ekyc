import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";


function NotificationBlock(props) {
    const sampleData = [
        {
            id: 'not_1',
            payload: {
                content: 'Tài liệu PYC XIN USER VPN - trieuth3 đã duyệt bởi ông/bà HD002932 PHẠM BÙI XUÂN LỘC - KCNTT-NHĐT. Nhấn vào để xem chi tiết.',
                isRead: false,
                createdAt: Date.parse(new Date())
            }
        },
        {
            id: 'not_1',
            payload: {
                content: 'test data',
                isRead: false,
                createdAt: Date.parse(new Date())
            }
        },
        {
            id: 'not_1',
            payload: {
                content: 'test data',
                isRead: false,
                createdAt: Date.parse(new Date())
            }
        },
    ]

    //custom here
    const renderNotificationType1 = (data) => {
        return <li>
            <a>
                {/* <div className="icon-circle bg-light-green">
                    <i className="fas fa-heart" style={{ color: "pink" }} />
                </div> */}
                <div className="menu-info">
                    <h4>{data.payload.content}</h4>
                    <p>
                        <i className="fas fa-clock" /> {data.payload.createdAt}
                    </p>
                </div>
            </a>
        </li>
    }

    return (
        <>
            {
                props.show &&
                <ul className="dropdown-menu notificationBLock">
                    <li className="header">NOTIFICATIONS</li>
                    <li className="body">
                        {
                            sampleData?.map((item) => {
                                return renderNotificationType1(item)
                            })
                        }
                    </li>
                    <li className="footer">
                        <a>View All Notifications</a>
                    </li>
                </ul>
            }
        </>
    )
}
NotificationBlock.propTypes = {
    show: PropTypes.bool
};

NotificationBlock.defaultProps = {
    show: false
};

export default NotificationBlock;