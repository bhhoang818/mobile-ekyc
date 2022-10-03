import { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import mobileDetectHOC from "../../../../hocs/mobileDetect"
import { isEmbedded } from 'react-device-detect';
import { openAppDeepLink } from "../../../../../../utils/common"
import ImageOptimize from "../../../../control/imageOptimize/imageOptimize"
import { withTranslation } from 'react-i18next';

class MobilePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePopup: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        if ($(window).width() < 769) {
            if ((window.pageYOffset)) {
                this.setState(prevState => ({
                    ...prevState,
                    hidePopup: true
                }));
            } else {
                this.setState(prevState => ({
                    ...prevState,
                    hidePopup: false
                }));
            }
        }
    }

    handleClick = () => {
        sessionStorage.isFirstTime = true;
        this.setState(prevState => ({
            ...prevState,
            hidePopup: true
        }));
    };

    render() {
        const { detectDevice, commons, t } = this.props;
        return (
            <>
                {
                    detectDevice?.isMobileApp ||
                    <>
                        {
                            this.state.hidePopup ||
                            <div className={`mobile-popup ${this.state.hidePopup ? "hide" : ""} ${sessionStorage.isFirstTime ? "hide" : ""}`}>
                                <i
                                    className="material-icons"
                                    onClick={() => this.handleClick()}
                                >
                                    close
                                </i>

                                <ImageOptimize
                                    className="mobile-popup__logo"
                                    src="/asset/images/logo-popup.png"
                                />

                                <div className="mobile-popup__content">
                                    <h5 className="mobile-popup__content__title">
                                        {t('headerPopup.headerName')}
                                    </h5>
                                    <div className="mobile-popup__content__detail">
                                        <div className="mobile-popup__content__detail__text">
                                            {t('headerPopup.desc')}
                                            <br />
                                            {detectDevice.os === "iOS" ? (
                                                t('headerPopup.freeIOS')
                                            ) : (
                                                t('headerPopup.freeAndroid')
                                            )}
                                        </div>
                                        <div
                                            onClick={() =>
                                                window.location = "https://hdbank.page.link/EwdR"
                                                //  openAppDeepLink(commons?.data?.footer, detectDevice)
                                            }
                                            className="mobile-popup__content__detail__download">
                                            {t('headerPopup.action')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                }
            </>
        );
    }
}
const mapStateToProps = state => {
    return {
        commons: state.commonReducer.commons,
        detectDevice: state.app.detectDevice
    };
};
export default withRouter(connect(mapStateToProps)(mobileDetectHOC(withTranslation('common')(MobilePopup))));
