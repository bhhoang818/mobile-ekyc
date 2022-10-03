import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import DynamicLink from '../../../../../../../component/common/DynamicLink/DynamicLink';
import ImageOptimize from '../../../../../control/imageOptimize/imageOptimize';
import { useTranslation } from 'react-i18next';
import mobileDetectHOC from '../../../../../hocs/mobileDetect';
import { getTypeCustomerByCode } from '../../../../../../../config/master';
import Collapse from 'component/Collapse';
import useOutsideClick from 'shared/packages/hooks/useOutsideClick';
import _get from 'lodash/get';
import { deeplinkActionRegister, deeplinkOTPMobile } from 'utils/common';

function SideBar(props) {
  const { onClickOutside, showSidebar } = { ...props };
  const { commons, homepage, commonHDBank } = useSelector((state) => state.commonReducer);
  const { detectDevice } = useSelector((state) => state.app);
  const [menuEff, setMenuEff] = useState(null);
  const { t } = useTranslation('common');
  const [activeMenu, setActiveMenu] = useState(0);
  const ref = useRef(null);
  useOutsideClick(ref, (e) => {
    const id = _get(e, 'target.id');
    let className = _get(e, 'target.className', '') || '';
    if (id !== 'toggle' && typeof className.includes === 'function' && !className.includes('btn-burger-icon')) {
      if (onClickOutside) {
        onClickOutside(e);
      }
    }
  });

  useEffect(() => {
    //menu dropdown sidebar
    $('.nav-sub').first().toggleClass('show');
    $('.nav-sub').first().slideDown(350);
    $('.nav-sub').first().addClass('active');

    $('.btn-dropdown').on('click', function () {
      $(this).toggleClass('active');
      $(this).parent().next().slideToggle();
      $('.btn-dropdown').not(this).parent().next().slideUp();
      $('.btn-dropdown').not(this).removeClass('active');
    });
    $('#sidebar-onlinesupport-button').on('click', function (e) {
      e.preventDefault();
      $('#modal-open-box-chat').trigger('click');
    });
    return () => {
      $('.accordion-title em').off('click');
      $('.btn-dropdown').off('click');
      $('#sidebar-onlinesupport-button').off('click');
    };
  }, [props]);

  useEffect(() => {
    if (commonHDBank?.data?.leftMenuList) {
      const merge = [
        ...commonHDBank?.data?.leftMenuList,
        {
          customerType: '9',
          img: '/asset/images/icons/pro-7.png',
          slugType: 'promotion',
          name: 'landing.siteFooter.promotion',
        },
        {
          customerType: '10',
          img: '/asset/images/icons/pro-7.png',
          slugType: 'promotion',
          name: 'landing.siteFooter.promotion',
        },
      ];

      setMenuEff(merge);
      setTimeout(() => {
        if ($('.side-navigation li').hasClass('active')) {
          $('.side-navigation li.active').find('.nav-sub').slideDown(350);
        }
        // let header = $('#nav-toggle');
        // let itemMenu = $('.menu-click-eff');

        // itemMenu.on('click', (e) => {
        //   header.removeClass('active');
        // });
      }, 0);
    }
  }, [commonHDBank]);

  const renderListMenu = (type, data) => {
    const dataFilter = data?.filter((x) => x.customerType === type?.code);
    if (dataFilter?.length > 0) {
      return (
        <ul className="nav-sub show">
          {dataFilter?.map((item, index) => {
            return (
              <li className="menu-click-eff" key={index}>
                <DynamicLink
                  href={
                    item?.slugType === 'promotion'
                      ? `/promotion?customer_type=${type?.customerType}`
                      : `/product?slug_type=${item?.slugType}&customer_type=${type?.customerType}`
                  }
                  as={
                    item?.slugType === 'promotion'
                      ? `/${type?.customerType}/promotion/`
                      : `/${type?.customerType}/product/${item?.slugType}`
                  }
                  scroll={true}
                >
                  <a>
                    <div className="icon" style={{ width: '24px', height: '26px' }}>
                      <ImageOptimize src={item?.img} alt={item?.name} />
                    </div>
                    {t(item?.name)}
                  </a>
                </DynamicLink>
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  const handleToggleMenu = (index) => {
    setActiveMenu(activeMenu !== index ? index : null);
  };

  return (
    <header className={showSidebar && 'active'} id="nav-toggle" ref={ref}>
      <div className="nav-toggle">
        <DynamicLink href="/" as="/">
          <a className="logo">
            {
              commons?.data?.logoHD &&
              <ImageOptimize src={commons?.data?.logoHD} />
            }
          </a>
        </DynamicLink>
        <div className="search-box">
          <form action="" method="post">
            <div className="form-group">
              <input
                className="searchinput"
                onChange={(e) => {
                  const kw = _get(e, 'target.value', '') || '';
                  props.setKeyWord(kw);
                }}
                type="text"
                name="inputSearch"
                placeholder={t('landing.sidebar.inputSearch')}
              />
              <DynamicLink
                href={`/search?keyword=${props.search.keyword}`}
                as={`/search?keyword=${props.search.keyword}`}
              >
                <button
                  disabled={props.search.keyword === null || props.search.keyword === ''}
                // onClick={() => {
                //   let header = $('#nav-toggle');
                //   header.removeClass('active');
                // }}
                >
                  <ImageOptimize src="/asset/images/icons/search.png" />
                </button>
              </DynamicLink>
            </div>
          </form>
        </div>
        <div className="srcoll-bar">
          <div className="login">
            <a className="btn-login" onClick={() => deeplinkActionRegister(props.isMobile, detectDevice?.isMobileApp)}>
              <p>{t('landing.sidebar.register')}</p>
            </a>
          </div>
          <div className='otp-option'>
            {
              deeplinkOTPMobile(props.isMobile, detectDevice,t)
            }
          </div>
          <div className="side-navigation-wrap">
            {
              <ul className="side-navigation">
                <li className={activeMenu === 0 ? 'active' : ''}>
                  <div className="accordion-title">
                    <DynamicLink href={`/product?slug_type=personal`} as={`/personal`} scroll={true}>
                      <a>{t('landing.personalProduct.title')}</a>
                    </DynamicLink>
                    <em onClick={() => handleToggleMenu(0)}></em>
                  </div>
                  <Collapse in={activeMenu === 0}>{renderListMenu(getTypeCustomerByCode('9'), menuEff)}</Collapse>
                </li>
                <li className={activeMenu === 1 ? 'active' : ''}>
                  <div className="accordion-title">
                    <DynamicLink href={`/product?slug_type=corporate`} as={`/corporate`} scroll={true}>
                      <a>{t('landing.coporateProduct.title')}</a>
                    </DynamicLink>
                    <em onClick={() => handleToggleMenu(1)}></em>
                  </div>
                  <Collapse in={activeMenu === 1}>{renderListMenu(getTypeCustomerByCode('10'), menuEff)}</Collapse>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/priority?customer_type=personal`} as={`/personal/priority`} scroll={true}>
                      <a>{t('landing.priorityProduct.title')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/investor`} as={`/investor`} scroll={true}>
                      <a>{t('landing.investorProduct.title')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/about`} as={`/about`} scroll={true}>
                      <a>{t('landing.siteFooter.about')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/news`} as={`/news`} scroll={true}>
                      <a>{t('breadcrumbs.news')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <a href="https://career.hdbank.com.vn/" target="_blank">
                      {t('landing.sidebar.job')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/atm-branch`} as={`/atm-branch`} scroll={true}>
                      <a>{t('landing.sidebar.atm')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/tool?customer_type=personal`} as={`/personal/cong-cu`} scroll={true}>
                      <a>{t('landing.sidebar.tool')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/QnA?customer_type=personal`} as={`/personal/QnA`} scroll={true}>
                      <a>{t('landing.sidebar.faq')}</a>
                    </DynamicLink>
                    <div className='new-icon'></div>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/utils/dangkymatbang`} as={`/utils/dangkymatbang`} scroll={true}>
                      <a className='highlight-link'>{t('landing.siteFooter.dangkymatbang')}</a>
                    </DynamicLink>
                    <div className="material-icons custom-position-icon highlight-link">star</div>
                  </div>
                </li>
                <li>
                  <div className="accordion-title">
                    <DynamicLink href={`/qrcode`} as={`/qrcode`} scroll={true}>
                      <a>{t('landing.sidebar.shorten')}</a>
                    </DynamicLink>
                  </div>
                </li>
                <li>
                  <ul className="nav-sub suport">
                    <li>
                      {' '}
                      <a href="tel:+19006060">
                        <ImageOptimize src="/asset/images/icons/phone-line.png" />
                        19006060
                      </a>
                    </li>
                    <li>
                      {' '}
                      <a href="" id="sidebar-onlinesupport-button">
                        <ImageOptimize src="/asset/images/icons/chat.png" />
                        {t('landing.sidebar.onlinesupport')}
                      </a>
                    </li>
                    <li>
                      {' '}
                      <a href="mailto:info@hdbank.com.vn">
                        <ImageOptimize src="/asset/images/icons/mail-line.png" />
                        {t('landing.sidebar.email')}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            }
          </div>
          {detectDevice?.isMobileApp || (
            <div className="download-app">
              <p>{t('landing.sidebar.downloadapp')}</p>
              <div className="icon d-flex align-center">
                <a href={commons?.data?.footer?.mobileApp?.android} target="_blank">
                  <ImageOptimize src="/asset/images/chplay.png" />
                </a>
                <a href={commons?.data?.footer?.mobileApp?.ios} target="_blank">
                  <ImageOptimize src="/asset/images/appstore.png" />
                </a>
              </div>
            </div>
          )}
          <div className="socail-list">
            <p>{t('landing.sidebar.connectapp')}</p>
            <ul className="d-flex align-center">
              <li>
                <a href={commonHDBank?.data?.social?.facebook} target="_blank">
                  <ImageOptimize src="/asset/images/icons/face.png" />
                </a>
              </li>
              {/* <li>
                <a href={commonHDBank?.data?.social?.instagram} target="_blank">
                  <ImageOptimize src="/asset/images/icons/instagram.png" alt="" />
                </a>
              </li> */}
              <li>
                <a href={commonHDBank?.data?.social?.zalo} target="_blank">
                  <ImageOptimize src="/asset/images/icons/zalo.png" />
                </a>
              </li>
              <li>
                <a href={commonHDBank?.data?.social?.tiktok} target="_blank">
                  <ImageOptimize src="/asset/images/icons/titok.png" />
                </a>
              </li>
              <li>
                <a href={commonHDBank?.data?.social?.youtube} target="_blank">
                  <ImageOptimize src="/asset/images/icons/youtube.png" />
                </a>
              </li>
            </ul>
            <p className="copy-right">{t('landing.common.copyright')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

SideBar.propTypes = {};

SideBar.defaultProps = {};

export default mobileDetectHOC(SideBar);
