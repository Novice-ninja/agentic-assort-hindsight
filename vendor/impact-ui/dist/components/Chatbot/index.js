!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.chatbot-modal-wrapper{position:relative;z-index:1300}.chatbot-modal-wrapper .chatbot-component-container{background:#fff;border-radius:12px;box-shadow:0 8px 32px #101e3629;padding:10px 16px 10px 10px;position:fixed}.chatbot-modal-wrapper .chatbot-component-container.is-dragging,.chatbot-modal-wrapper .chatbot-component-container.is-resizing{transition:none!important;-webkit-user-select:none;user-select:none}.chatbot-modal-wrapper .chatbot-component-container.is-dragging{cursor:grabbing}.chatbot-modal-wrapper .chatbot-component-container.is-collapsed{overflow:hidden;padding:16px;padding-top:unset}.chatbot-modal-wrapper .chatbot-component-container.full-width{height:calc(100vh - 56px);left:auto!important;right:0;top:56px;width:calc(100vw - 64px)}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-header-close-icon{height:26px;width:26px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-landing-screen-container{display:flex;flex:1 1 auto;flex-direction:column;height:100%;min-height:0;pointer-events:none;position:relative;width:100%}.chatbot-modal-wrapper .chatbot-component-container .chatbot-landing-screen-container .chatbot-landing-screen-container-body{display:flex;flex:1 1 auto;flex-direction:column;min-height:0;overflow-y:auto}.chatbot-modal-wrapper .chatbot-component-container .chatbot-landing-screen-container .chatbot-landing-screen-container-close-icon{align-items:center;display:flex;flex-shrink:0;gap:10px;justify-content:flex-end;pointer-events:auto}.chatbot-modal-wrapper .chatbot-component-container .chatbot-landing-screen-container .chatbot-landing-screen-container-circle-1{background:#418dffab;border-radius:50%;filter:blur(68px);height:118px;left:calc(50% - 120px);position:absolute;top:calc(50% - 60px);width:118px;z-index:1}.chatbot-modal-wrapper .chatbot-component-container .chatbot-landing-screen-container .chatbot-landing-screen-container-circle-2{background:#ffb4d8;border-radius:50%;filter:blur(80px);height:189px;left:calc(50% - 20px);position:absolute;top:calc(50% - 40px);width:189px;z-index:2}.chatbot-modal-wrapper .chatbot-component-container .chatbot-main-content{box-sizing:border-box;display:flex;gap:20px;height:100%;width:100%}.chatbot-modal-wrapper .chatbot-component-container .chatbot-drag-strip{cursor:grab;height:18px;left:10px;position:absolute;right:10px;top:10px;touch-action:none;z-index:15}.chatbot-modal-wrapper .chatbot-component-container .chatbot-drag-strip:active{cursor:grabbing}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side{height:100%;position:relative;width:60px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side:before{background:linear-gradient(180deg,#b3bdf8,#eceefd 61%,#f7bea3b3);border-radius:12px;content:"";top:0;right:0;bottom:0;left:0;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px;pointer-events:none;position:absolute;z-index:2}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side.chatbot-component-left-side-open{width:400px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container{display:flex;height:100%;justify-content:center;width:100%}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open{justify-content:unset}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper{flex:1;height:100%;padding:12px 12px 12px 0}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper .book-mark-panel-container{background:linear-gradient(180deg,#f0f2ff99,#ffeff871 50%,#ffeceb40);box-shadow:12px 13px 45px -1px #402b701c;display:flex;flex-direction:column;gap:16px;height:100%;padding:20px 16px 0;position:relative;width:100%}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper .book-mark-panel-container:before{background:linear-gradient(187.22deg,#b3bdf8b3,#fff 57.21%,#cdcaf5);border-radius:12px;content:"";top:0;right:0;bottom:0;left:0;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px;pointer-events:none;position:absolute;z-index:2}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper .book-mark-panel-container .book-mark-panel-header{align-items:center;display:flex;justify-content:space-between;width:100%}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper .book-mark-panel-container .book-mark-panel-header .book-mark-panel-header-left{align-items:center;display:flex;gap:7px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper .book-mark-panel-container .book-mark-panel-header .book-mark-panel-header-left .book-mark-panel-header-left-title{color:#0d152c;font-size:16px;font-weight:800;line-height:24px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container.chatbot-component-menu-container-open .book-mark-panel-container-wrapper .book-mark-panel-container .book-mark-panel-header .book-mark-panel-header-right{align-items:center;display:flex;gap:12px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container{background:linear-gradient(180deg,#f0f2ff99,#ffeff871 50%,#ffeceb40);border-radius:12px;position:relative;z-index:1}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon{align-items:center;display:flex;flex-direction:column;justify-content:space-between;padding:12px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon.chatbot-component-menu-container-icon-open{padding:12px;width:60px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .chatbot-component-menu-list{align-items:center;display:flex;flex-direction:column;gap:12px;list-style:none;margin:0;padding:0}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .chatbot-component-menu-list li{align-items:center;border-radius:8px;cursor:pointer;display:flex;height:37px;justify-content:center;width:37px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .chatbot-component-menu-list li:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .chatbot-component-menu-list li:focus:not(:focus-visible){box-shadow:none;outline:none}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .chatbot-component-menu-list li:hover{background:linear-gradient(152deg,#b3bdf82b 17.25%,#b3bdf89c 122.41%)}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .utility-list li:hover{background:linear-gradient(152deg,#b3bdf82b 17.25%,#b3bdf89c 122.41%)!important}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .active{background:linear-gradient(152deg,#b3bdf82b 17.25%,#b3bdf89c 122.41%)}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-list img{cursor:pointer}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon-new-chat{margin-bottom:10px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon-notification{height:16px;width:16px}.chatbot-modal-wrapper .chatbot-component-right-side{display:flex;flex:1 1 auto;flex-direction:column;min-height:0;min-width:0;transition:none!important}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-header{align-items:center;display:flex;justify-content:space-between}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-header .chatbot-component-header-dropdown .ia-btn-icon{margin-bottom:0}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-header .chatbot-component-header-dropdown .chatbot-component-header-dropdown-text{font-size:12px;font-weight:400}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body{align-items:center;display:flex;flex:1 1 auto;justify-content:center;min-height:0;overflow-y:auto}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-container{display:flex;flex:1;flex-direction:column;gap:10px;justify-content:center}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-container .chatbot-component-body-icon.rotating{animation:chatbot-rotate .7s linear}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-container .chatbot-component-body-icon{align-items:center;display:flex;height:84px;justify-content:center;margin:auto;width:84px}@keyframes chatbot-rotate{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-container .chatbot-component-body-icon{height:54px;width:54px}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-text{align-items:center;display:flex;flex-direction:column;gap:5px;justify-content:center}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-text .chatbot-component-body-text-title{color:#1f2b4d;font-size:26px;font-weight:600}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-text .chatbot-component-body-text-title .chatbot-component-body-text-username{background:linear-gradient(82deg,#ec7550 10.92%,#a0508f 81.37%);-webkit-background-clip:text;font-weight:700;-webkit-text-fill-color:#0000;background-clip:text;color:#0000;line-height:47px}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-text .chatbot-component-body-text-title .chatbot-component-body-text-username img{height:20px;margin-left:6px;margin-top:-2px;vertical-align:middle;width:20px}.chatbot-modal-wrapper .chatbot-component-right-side .chatbot-component-body .chatbot-component-body-text .chatbot-component-body-text-description{color:#7a8294;font-size:16px;font-weight:500;margin-bottom:15px}.chatbot-modal-wrapper .chatbot-header-row{flex-shrink:0}.chatbot-modal-wrapper .conversation-screen-container-header{align-items:center;container-name:screen-container;container-type:inline-size;display:flex;gap:12px;justify-content:space-between;min-width:0}.chatbot-modal-wrapper .conversation-screen-container-header.draggable{cursor:grab;touch-action:none}.chatbot-modal-wrapper .conversation-screen-container-header.draggable:active{cursor:grabbing}.chatbot-modal-wrapper .conversation-screen-container-header.draggable img{-webkit-user-drag:none;-webkit-user-select:none;user-select:none}.chatbot-modal-wrapper .conversation-screen-container-header.collapsed{height:50px}.chatbot-modal-wrapper .conversation-screen-container-header .left_logo_arrow_container{align-items:center;display:flex;flex-shrink:0;gap:5px}.chatbot-modal-wrapper .conversation-screen-container-header .left_logo_arrow_container .conversation_chatbot_logo_container img{height:18px;width:18px}.chatbot-modal-wrapper .conversation-screen-container-header .left_logo_arrow_container .conversation_chatbot_logo_container .left_logo_arrow_container{align-items:center;display:flex;gap:5px}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container{background:linear-gradient(91deg,#f8f8ff 54.01%,#ffe4e400 107.24%);border:1px solid #b3bdf8;border-radius:37px;display:flex;flex:1 1 auto;height:30px;max-width:600px;min-width:0;overflow:visible;position:relative}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container:focus:not(:focus-visible){box-shadow:none;outline:none}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container{flex:1 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container::-webkit-scrollbar{display:none}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container{margin-bottom:-1px;padding-bottom:1px}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul{align-items:flex-end;box-sizing:border-box;display:flex;gap:12px;height:100%;padding:0 15px;width:max-content}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li{align-items:center;border:1px solid #0000;border-bottom:none;border-radius:8px 8px 0 0;color:#1f2b4d;cursor:pointer;display:flex;font-size:12px;gap:4px;height:25px;padding:4px 12px;position:relative}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li:focus:not(:focus-visible){box-shadow:none;outline:none}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li:hover:not(.active){background:#ffffff8c}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li .close_thread img{height:8px;width:8px}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li.active{background:#fff;border-color:#b3bdf8;border-bottom:none;height:26px;margin-bottom:-1px;z-index:2}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li.active:after,.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li.active:before{bottom:-1px;content:"";height:10px;pointer-events:none;position:absolute;width:10px}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li.active:before{background:radial-gradient(circle at 0 0,#0000 10px,#b3bdf8 0,#b3bdf8 11px,#fff 0);left:-10px}.chatbot-modal-wrapper .conversation-screen-container-header .center_options_container .left_tabs_container ul li.active:after{background:radial-gradient(circle at 100% 0,#0000 10px,#b3bdf8 0,#b3bdf8 11px,#fff 0);right:-10px}.chatbot-modal-wrapper .conversation-screen-container-header .right_close_save_icon_container{display:flex;flex-shrink:0;gap:10px}.chatbot-modal-wrapper .conversation-screen-container-header .right_close_save_icon_container .collapse_icon_container{align-items:center;background:#f5f6fa;border-radius:8px;cursor:pointer;display:flex;justify-content:center;max-height:32px}.chatbot-modal-wrapper .conversation-screen-container-header .right_close_save_icon_container .collapse_icon_container .ia-btn-icon{align-items:center;display:flex;justify-content:center;margin-bottom:0}.chatbot-modal-wrapper .conversation-screen-container{display:flex;flex:1 1 auto;flex-direction:column;margin-top:6px;min-height:0;min-width:0}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container.show-suggestion-banner{margin-top:16px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container.collapsed{margin-top:unset}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container{box-sizing:border-box;flex:1 1 auto;min-height:0;overflow-y:auto;scrollbar-width:none}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .time_stamp_badge_chat_container{align-items:center;display:flex;justify-content:center;margin-bottom:10px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .time_stamp_badge_chat_container .time_stamp_badge_chat{align-items:center;background:linear-gradient(90deg,#f5f5f5 6%,#f5f5f500 120%);border:1px solid #d9dde7;border-radius:23px;box-sizing:border-box;color:#60697d;display:flex;font-size:12px;font-weight:500;height:23px;max-width:100%;padding:2px 8px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .user_chat_messages_container{align-items:flex-end;display:flex;flex-direction:column;gap:10px;justify-content:flex-end;margin-bottom:35px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .user_chat_messages_container .user_chat_message{background:linear-gradient(91deg,#dfe7ff66 .67%,#e4d8ff52,#ffcbcc45 111.65%);border-radius:12px;max-width:550px;padding:8px 12px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .user_chat_messages_container .user_chat_message .user_chat_message_text{color:#1f2b4d;font-size:14px;font-weight:500;line-height:18px;word-wrap:break-word}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .user_chat_messages_container .user_chat_message .time_chat{color:#60697d;font-size:12px;font-weight:500;margin-top:4px;text-align:right}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container{display:flex;margin-bottom:35px;width:100%}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .chat_logo_circle{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/chat-icon-circle.svg) no-repeat 50%;height:25px;width:25px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .chat_logo_circle_empty{height:25px;width:25px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .loading_messages{align-items:center;animation:none;background:#0000;border:none;display:flex;gap:4px;height:25px;justify-content:center;margin-left:12px;width:25px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .loading_messages .dot{animation:loading-dot-bounce-vertical 1.2s infinite;background:#1f2b4d;border-radius:50%;height:6px;opacity:1;transform:translateY(0);width:6px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .loading_messages .dot:first-child{animation-delay:0s}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .loading_messages .dot:nth-child(2){animation-delay:.2s}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .loading_messages .dot:nth-child(3){animation-delay:.4s}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container{margin-left:12px;width:80%;word-wrap:break-word}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_with_dropdown_container{color:#7a8294;display:inline-flex;font-size:12px;margin-bottom:10px;padding-right:13px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_with_dropdown_container:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_with_dropdown_container:focus:not(:focus-visible){box-shadow:none;outline:none}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container{background:#fff;border-radius:12px;box-shadow:0 0 4px #7c5cb1;padding:8px 12px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container.questions-container{background:#0000;box-shadow:none}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container .assistant_text_container{color:#1f2b4d;font-size:14px;line-height:18px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container .assistant_form_container{display:flex;flex-direction:column;gap:8px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container .assistant_form_container .datePicker-input-container,.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container .assistant_form_container .dateRangePicker-container{width:100%}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_main_container .time_chat{color:#60697d;font-size:12px;font-weight:500;margin-top:4px;text-align:right}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .questions-container{background:#0000}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container{align-items:center;display:flex;gap:8px;margin-top:12px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .asst_feedback_buttons{background:#0000;border:none;border-radius:4px;cursor:pointer}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .asst_feedback_buttons:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .asst_feedback_buttons:focus:not(:focus-visible){box-shadow:none;outline:none}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action{display:flex;gap:4px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .good_feedback{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-up.svg) no-repeat;background-size:cover;height:20px;transition:background-image .2s;width:20px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .animatingLike{animation:rotateUpDown 1s forwards}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .animatingDislike{animation:rotateDownUp 1s forwards}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .liked{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-up-filled.svg) no-repeat;background-position:50%;background-size:auto}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .bad_feedback{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-down.svg) no-repeat;background-size:cover;height:20px;width:20px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .disliked{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-down-filled.svg) no-repeat;background-position:50%;background-size:auto}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .left_icon_container_action .speaker{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/speaker.svg) no-repeat;background-size:cover;height:20px;width:20px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .button_url_container{border-left:1px solid #d9dde7;padding-left:10px}.chatbot-modal-wrapper .conversation-screen-container .conversation-body-container .assistant_chat_messages_container .response_main_container .assistant_actions_container .button_url_container .asst_feedback_buttons{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/add-thread.svg) no-repeat;color:#60697d;padding-left:24px}@keyframes loading-dot-bounce-vertical{0%,80%,to{transform:translateY(0)}40%{transform:translateY(-8px)}}.chatbot-modal-wrapper .chatbot-component-footer{align-items:center;display:flex;flex-shrink:0;justify-content:center;padding:8px}.chatbot-modal-wrapper .chatbot-component-footer .chatbot-component-footer-text,.chatbot-modal-wrapper .chatbot-component-footer .chatbot-component-footer-text-link{color:#7a8294;font-size:12px;font-weight:500;line-height:14px}.chatbot-modal-wrapper .chatbot-component-container .chatbot-component-left-side .chatbot-component-menu-container .chatbot-component-menu-container-icon .chatbot-component-menu-list li:first-child:hover{background:#0000}.dis_none{display:none!important}.bold{font-weight:700}.green_text{color:#108431}.red_text{color:#ec4c5c}.resizer{position:absolute;touch-action:none;z-index:20}.resizer:focus-visible{outline:2px solid #4259ee;outline-offset:-2px}.resizer-n,.resizer-s{cursor:row-resize;height:8px;left:16px;right:16px}.resizer-n{top:0}.resizer-s{bottom:0}.resizer-e,.resizer-w{bottom:16px;cursor:col-resize;top:16px;width:8px}.resizer-e{right:0}.resizer-w{left:0}.resizer-ne,.resizer-sw{cursor:nesw-resize;height:16px;width:16px}.resizer-nw,.resizer-se{cursor:nwse-resize;height:16px;width:16px}.resizer-ne{right:0;top:0}.resizer-nw{left:0;top:0}.resizer-se{bottom:0;right:0}.resizer-sw{bottom:0;left:0}.no-select{user-select:none!important;-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important}.book-mark-panel-tabs-container{height:38px}.bookmark-tabs{align-items:center;display:flex;height:100%;justify-content:space-around;position:relative}.bookmark-tabs:after{background:#b3bdf8;bottom:0;content:" ";height:1px;left:-16px;position:absolute;right:-16px}.bookmark-tab{color:#60697d;cursor:pointer;font-size:16px;font-weight:500;position:relative;transition:color .2s}.bookmark-tab.active:after{background:#4259ee;bottom:-10px;content:"";height:2px;left:-25px;position:absolute;right:-25px}.bookmark-panel-body{align-items:center;background:#0000;display:flex;gap:8px;padding:8px 0}.drag-handle{color:#b3b3b3;cursor:grab;font-size:22px;-webkit-user-select:none;user-select:none}.bookmark-question-text{color:#31416e;font-size:16px;font-weight:500;line-height:1.2}.bookmark-menu{color:#b3b3b3;cursor:pointer;font-size:26px;margin-left:16px}@keyframes rotateUpDown{0%{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-up.svg);transform:rotate(0)}20%{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-up-blue.svg);transform:rotate(-15deg)}80%{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-up-blue.svg);transform:rotate(0)}to{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-up-filled.svg);transform:rotate(0)}}@keyframes rotateDownUp{0%{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-down.svg);transform:rotate(0)}20%{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-down-blue.svg);transform:rotate(15deg)}80%{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-down-blue.svg);transform:rotate(0)}to{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/thumbs-down-filled.svg);transform:rotate(0)}}.conversation-footer-container{box-sizing:border-box;container-name:inputbox;container-type:inline-size;flex-shrink:0;height:auto;padding-top:8px}.conversation-footer-container .MuiTextField-root .MuiOutlinedInput-root fieldset{border:1px solid #d9dde7}.conversation-footer-container .MuiTextField-root .MuiOutlinedInput-root.Mui-focused fieldset,.conversation-footer-container .MuiTextField-root .MuiOutlinedInput-root:hover fieldset{border:1px solid #b3bdf8}.conversation-footer-container .css-1eow9i0-MuiInputBase-root-MuiOutlinedInput-root{font-size:14px;padding:12px}.suggestion-banner{align-items:center;background:linear-gradient(90deg,#eceefd,#f5ecfd);border-radius:8px;box-shadow:0 0 16px 2px #0000000f;color:#425690;display:flex;gap:8px;justify-content:space-between;overflow:hidden;padding-inline:8px;padding:6px 10px;position:relative;z-index:999}.suggestion-banner img{height:20px;width:20px}.suggestion-banner .suggestion-banner-content{align-items:center;display:flex;gap:12px}.suggestion-banner .suggestion-banner-text{font-size:14px;font-weight:400;line-height:21px}.suggestion-banner:before{background:linear-gradient(90deg,#b3bdf8,#d6cbe633);border-radius:9px;content:"";top:0;right:0;bottom:0;left:0;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px;position:absolute;z-index:0}.stop-icon-button .ia-btn-icon{height:auto;margin-bottom:0;width:auto}.chat-input-box{border-radius:12px;display:flex;flex-direction:column;gap:6px}.chat-input-box.new-chat-screen{width:100%}.chat-input-box.custom-screen{width:95%}.chat-input-container{background:#fff;border:1px solid #d9dde7;border-radius:12px;box-shadow:0 0 12px 8px #0000000f;padding:12px;position:relative;width:100%}.chat-input-container:focus-within,.chat-input-container:hover{border:1px solid #b3bdf8}.chat-input-wrapper{align-items:flex-end;display:flex;max-height:182px;transition:all .2s ease-in-out;width:100%}.chat-input-wrapper.stacked{align-items:stretch;flex-direction:column}.chat-input-wrapper.empty{align-items:flex-end;flex-direction:row}.chat-input-wrapper.single-line-textarea{align-items:center}.chat-textarea{background:#0000;border:none;color:#1f2b4d;flex:1;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;line-height:160%;max-height:142px;outline:none;overflow-y:hidden;padding:0;resize:none}.chat-textarea::placeholder{color:#b4bac7}.chat-textarea{transition:all .2s ease-in-out}.chat-textarea.scrollable{overflow-y:auto}.chat-actions{align-items:flex-end;display:flex;gap:12px;height:32px;justify-content:flex-end}.chat-actions.fixed{height:36px}.chat-actions.not-fixed{height:32px}.history-panel-container{border:1px solid #000;border-radius:8px;display:flex;flex:1;flex-direction:column;gap:12px;margin:12px 12px 12px 0;min-width:0;padding:12px}.history-panel-header{align-items:center;border-bottom:1px solid #d9dde7;display:flex;justify-content:space-between;padding-bottom:8px}.history-panel-header span{font-weight:600}.history-panel-header img{cursor:pointer;height:16px;width:16px}.history-panel-header img:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.history-panel-header img:focus:not(:focus-visible){box-shadow:none;outline:none}.history-panel-search input{background:#fff;border:1px solid #d9dde7;border-radius:8px;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;outline:none;padding:8px 10px;width:100%}.history-panel-search input::placeholder{color:#b4bac7}.history-panel-search input:focus{border:1px solid #b3bdf8}.history-panel-groups{display:flex;flex-direction:column;gap:8px;height:100%;overflow:auto}.history-pinned-list{display:flex;flex-direction:column;gap:6px;list-style:none;margin:0 0 8px;padding:0}.history-pinned-item{background:#6366f114;border-color:#b3bdf8}.history-group{display:flex;flex-direction:column;gap:6px}.history-group-header{align-items:center;background:#0000;border:none;border-radius:6px;color:#1f2b4d;cursor:pointer;display:flex;gap:6px;padding:6px 2px;text-align:left}.history-group-header:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.history-group-header:focus:not(:focus-visible){box-shadow:none;outline:none}.history-group-header .chevron{display:inline-block;width:12px}.history-group-header .group-title{font-weight:600}.history-group-list{display:flex;flex-direction:column;gap:6px;list-style:none;margin:0;padding:0}.history-item{align-items:center;background:#fff;border:1px solid #d9dde7;border-radius:8px;cursor:pointer;display:flex;justify-content:space-between;padding:10px 12px;position:relative}.history-item:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.history-item:focus:not(:focus-visible){box-shadow:none;outline:none}.history-item:hover{border-color:#b3bdf8}.history-item.active{border:2px solid #b3bdf8}.history-item-row{align-items:center;display:flex;gap:8px;justify-content:space-between;width:100%}.item-menu-trigger{background:#0000;border:none;border-radius:6px;cursor:pointer;line-height:1;opacity:0;padding:2px 6px;transition:opacity .15s ease-in-out,background .15s ease-in-out}.item-menu-trigger:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.item-menu-trigger:focus:not(:focus-visible){box-shadow:none;outline:none}.item-menu-trigger:hover{background:#f3f4f6}.history-item:hover .item-menu-trigger{opacity:1}.item-menu-trigger:focus-visible{opacity:1}.item-menu-trigger.always-visible{opacity:1}.history-item-menu{background:#fff;border:1px solid #d9dde7;border-radius:10px;box-shadow:0 4px 20px #00000014;display:flex;flex-direction:column;gap:6px;min-width:180px;padding:8px;position:absolute;right:8px;top:36px;z-index:5}.history-item-menu .menu-item{background:#0000;border:none;border-radius:8px;color:#1f2b4d;cursor:pointer;padding:10px;text-align:left}.history-item-menu .menu-item:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.history-item-menu .menu-item:focus:not(:focus-visible){box-shadow:none;outline:none}.history-item-menu .menu-item:hover{background:#f7f7f9}.history-item-menu .menu-item.danger{color:#d12c2c}.history-item-name{color:#1f2b4d;font-size:14px;font-weight:500;line-height:21px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pin-icon{margin-right:8px}.history-empty-state{align-items:center;color:#b4bac7;display:flex;flex:1;font-size:12px;justify-content:center;padding:12px 0}.chatbot-component-header-dropdown-container{background-color:#fff;border-radius:18px;box-shadow:0 1px 6px #1933451a;min-width:340px;padding:16px;position:absolute;top:52px;z-index:999999}.chatbot-component-header-dropdown-container .item{background-color:#fff;cursor:pointer;display:flex;flex-direction:column;gap:6px;justify-content:center}.chatbot-component-header-dropdown-container .item.isCollapsed{gap:8px}.chatbot-component-header-dropdown-container .item-container{align-items:center;display:flex;height:66px;justify-content:space-between;padding:12px}.chatbot-component-header-dropdown-container .item-container.isCollapsed{height:50px}.chatbot-component-header-dropdown-container .item-content{align-items:center;display:flex;gap:10px}.chatbot-component-header-dropdown-container .item-content-text{display:flex;flex-direction:column}.chatbot-component-header-dropdown-container .item-content-text-name{color:#1f2b4d;font-size:16px;font-weight:600;line-height:24px}.chatbot-component-header-dropdown-container .item-content-text-name.collapsed{font-size:14px}.chatbot-component-header-dropdown-container .item-content-text-description{color:#7a8294;font-size:12px;font-weight:500;line-height:16px}.chatbot-component-header-dropdown-container .item-content-text-description.collapsed{font-size:12px}@container inputbox (max-width: 500px){.chat-input-container{padding:4px 12px}.suggestion-banner .suggestion-banner-text{font-size:12px}}@container screen-container (max-width: 500px){.chat-input-container{padding:4px 12px}.suggestion-banner .suggestion-banner-text{font-size:12px}}')),document.head.appendChild(e)}}catch(o){console.error("vite-plugin-css-injected-by-js",o)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect, isValidElement, cloneElement } from "react";
import { useDraggableResizable, BOTTOM_VIEWPORT_MARGIN } from "../../hooks/useDraggableResizable.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Tooltip } from "../Tooltip/index.js";
import { BookMarkPanel } from "./bookMarkPanel.js";
import ChatBotLandingScreen from "./chatBotLandingScreen.js";
import { ChatbotModuleMenu } from "./chatbotModuleMenu.js";
import { newChatMenuItem, mandatoryTabList, menuItems } from "./constant.js";
import { ConversationScreen } from "./conversationScreen.js";
import { CustomScreen } from "./customScreen.js";
import { HistoryPanel } from "./historyPanel.js";
import { NewChatComponent } from "./newChatComponent.js";

import { useTranslation } from "../../i18n/useTranslation.js";
const BookmarkIcon = getAssetUrl("icons/bookmarkIcon.svg");
const HEADER_HEIGHT = 56;
const SIDEBAR_WIDTH = 72;
const DEFAULT_CONTENT_WIDTH = 640;
const DEFAULT_WIDTH = SIDEBAR_WIDTH + DEFAULT_CONTENT_WIDTH;
const COLLAPSED_SIZE = { width: 410, height: 490 };
const FLOATING_VIEWPORT_MARGIN = BOTTOM_VIEWPORT_MARGIN;
const FLOATING_MARGIN = {
  top: HEADER_HEIGHT,
  right: FLOATING_VIEWPORT_MARGIN,
  bottom: FLOATING_VIEWPORT_MARGIN,
  left: FLOATING_VIEWPORT_MARGIN
};
const DOCKED_MARGIN = { top: HEADER_HEIGHT, right: 0, bottom: 0, left: FLOATING_VIEWPORT_MARGIN };
const COLLAPSED_RESIZE_DIRECTIONS = ["n", "s", "ne", "e", "nw", "se", "sw", "w"];
const EXPANDED_RESIZE_DIRECTION = ["w"];
function getDockedRect(panelsOpen = false) {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
  const width = panelsOpen ? DEFAULT_WIDTH + 360 : DEFAULT_WIDTH;
  return {
    x: viewportWidth - width,
    y: HEADER_HEIGHT,
    width,
    height: viewportHeight - HEADER_HEIGHT
  };
}
function getDefaultRect(isFullWidth) {
  if (!isFullWidth) return getDockedRect(false);
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
  const width = viewportWidth - 64;
  return {
    x: viewportWidth - width,
    y: HEADER_HEIGHT,
    width,
    height: viewportHeight - HEADER_HEIGHT
  };
}
function renderTabIcon(icon, key, iconClassName) {
  if (typeof icon === "string") {
    return /* @__PURE__ */ jsx("img", { alt: key, className: iconClassName, src: icon });
  }
  if (isValidElement(icon)) {
    const el = icon;
    return cloneElement(el, {
      "aria-hidden": void 0,
      "aria-label": key,
      role: "img",
      className: [el.props.className, iconClassName].filter(Boolean).join(" ") || void 0
    });
  }
  return icon;
}
const MENU_ITEM_LABEL_KEYS = {
  newchat: "chatBot.menu.newChat",
  bookmark: "chatBot.menu.bookmark",
  history: "chatBot.menu.history",
  page: "chatBot.menu.page",
  notification: "chatBot.menu.notification"
};
const getMenuItemLabel = (item, t) => {
  if (!item.key) return "";
  const labelKey = MENU_ITEM_LABEL_KEYS[item.key];
  if (labelKey) return t(labelKey);
  return item.key.charAt(0).toUpperCase() + item.key.slice(1);
};
function ChatBotComponent({
  onClose,
  userName,
  isChatBotOpen,
  setIsChatBotOpen,
  conversation = {},
  solution: _solution,
  formComponent: _formComponent,
  tableComponent: _tableComponent,
  preDefinedQuestions,
  addedByYouQuestions,
  onSendIconClick = () => {
  },
  assistantChats: _assistantChats = [],
  isAssistantThinking = false,
  moduleList = [],
  onModuleClick = () => {
  },
  tabList,
  handleSavedChat,
  threadList = ["Home", "Thread 1", "Thread 2"],
  activeThread = null,
  isCustomScreen = false,
  customScreenJsx = null,
  onLikeClick = () => {
  },
  onDislikeClick = () => {
  },
  handleNewChatClick = () => {
  },
  inputText = "",
  handleRefresh,
  handleSaveChat,
  handleMicClick,
  hideMenuArrow = false,
  newChatScreen = false,
  isModuleListLoading = false,
  suggestionBanner,
  isStopIcon = false,
  onStopIconClick = () => {
  },
  landingScreen = false,
  footerText,
  onCloseSuggestionBanner = () => {
  },
  showSuggestionBanner = false,
  utilityList = [],
  customInputComponent = null,
  onHistoryPanelClick = () => {
  },
  historyPanelData = [],
  onHistorySearchChange = () => {
  },
  onHistorySelectConversation = () => {
  },
  onHistoryToggleGroup = () => {
  },
  historyOpenGroups,
  onHistoryMenuAction = () => {
  },
  showHistoryPanel = true,
  isFullWidth = false,
  activeConversationId,
  handleCloseThread = () => {
  },
  handleThreadClick = () => {
  },
  onMinimiseChatBot,
  onChatBotResize = () => {
  }
}) {
  var _a;
  const { t } = useTranslation();
  const resolvedSuggestionBanner = suggestionBanner ?? {
    freeTextHeading: t("chatBot.suggestionBanner.freeTextHeading"),
    freeTextContent: t("chatBot.suggestionBanner.freeTextContent")
  };
  const resolvedFooterText = footerText ?? t("chatBot.footerText");
  const [, setIsNewChat] = useState(
    (tabList == null ? void 0 : tabList.find((tab) => tab.isActive)) ? false : newChatScreen ? true : false
  );
  const [inputValue, setInputValue] = useState(inputText);
  const [activeList, setActiveList] = useState((_a = tabList == null ? void 0 : tabList.find((tab) => tab.initialClick)) == null ? void 0 : _a.name);
  const [isBookMarkPanelOpen, setIsBookMarkPanelOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isPagePanelOpen, setIsPagePanelOpen] = useState(false);
  const [userChats, setUserChats] = useState([]);
  const [menuItems$1, setMenuItems] = useState([]);
  const [localHistoryOpenGroups, setLocalHistoryOpenGroups] = useState({});
  const [isMinimised, setIsMinimised] = useState(false);
  const initialRectRef = useRef(getDefaultRect(isFullWidth));
  const panelsOpen = useMemo(
    () => isBookMarkPanelOpen || isHistoryPanelOpen || isPagePanelOpen,
    [isBookMarkPanelOpen, isHistoryPanelOpen, isPagePanelOpen]
  );
  const viewportMargin = isMinimised ? FLOATING_MARGIN : DOCKED_MARGIN;
  const {
    rect,
    isDragging,
    isResizing,
    isCollapsed,
    setRect,
    dragHandleProps,
    getResizeHandleProps,
    collapseTo,
    restore: restoreFromCollapse
  } = useDraggableResizable({
    initialRect: initialRectRef.current,
    minWidth: panelsOpen ? DEFAULT_WIDTH + 360 : COLLAPSED_SIZE.width,
    minHeight: COLLAPSED_SIZE.height,
    maxWidth: typeof window !== "undefined" ? window.innerWidth : void 0,
    maxHeight: typeof window !== "undefined" ? window.innerHeight : void 0,
    // Edge guard only applies while floating (minimised): the panel keeps a gap from every
    // viewport edge (and clears the app header at the top) instead of touching it. Expanded/
    // docked stays flush, like the original panel.
    viewportMargin,
    disabled: isFullWidth,
    onChange: (nextRect) => {
      onChatBotResize(nextRect.width);
    }
  });
  const resolveDirectionForResize = isCollapsed ? COLLAPSED_RESIZE_DIRECTIONS : EXPANDED_RESIZE_DIRECTION;
  const handleToggleCollapse = () => {
    if (isCollapsed) {
      setIsMinimised(false);
      restoreFromCollapse();
    } else {
      setIsBookMarkPanelOpen(false);
      setIsHistoryPanelOpen(false);
      setIsPagePanelOpen(false);
      setIsMinimised(true);
      collapseTo(COLLAPSED_SIZE, { anchor: "bottom-right", viewportMargin: FLOATING_MARGIN });
    }
  };
  const NON_DRAGGABLE_SELECTOR = 'button, a, input, textarea, [role="button"], [role="tab"], [contenteditable="true"]';
  const headerDragHandleProps = isCollapsed && !isFullWidth ? {
    ...dragHandleProps,
    onPointerDown: (e) => {
      if (e.target.closest(NON_DRAGGABLE_SELECTOR)) return;
      dragHandleProps.onPointerDown(e);
    }
  } : void 0;
  const tabListRef = useRef(tabList);
  const menuItemsRef = useRef(menuItems$1);
  const onChatBotResizeRef = useRef(onChatBotResize);
  useEffect(() => {
    tabListRef.current = tabList;
    menuItemsRef.current = menuItems$1;
    onChatBotResizeRef.current = onChatBotResize;
  });
  useEffect(() => {
    setInputValue(inputText);
  }, [inputText]);
  useEffect(() => {
    if (tabList && Array.isArray(tabList)) {
      setMenuItems([
        newChatMenuItem,
        ...tabList.map((tab, idx) => {
          var _a2, _b;
          return {
            ...tab,
            key: ((_a2 = tab.name) == null ? void 0 : _a2.toLowerCase()) || `tab${idx}`,
            icon: tab.icon || BookmarkIcon,
            className: `chatbot-component-menu-container-icon-${(_b = tab.name) == null ? void 0 : _b.toLowerCase()}`,
            label: tab.name,
            onClick: tab.onClick
          };
        }),
        ...showHistoryPanel ? mandatoryTabList : []
      ]);
    } else {
      setMenuItems([newChatMenuItem, ...menuItems]);
    }
  }, [tabList, showHistoryPanel]);
  useEffect(() => {
    var _a2, _b, _c;
    if (!isChatBotOpen) return;
    setActiveList((_b = (_a2 = tabListRef.current) == null ? void 0 : _a2.find((tab) => tab.initialClick)) == null ? void 0 : _b.name);
    const initialItem = menuItemsRef.current.find((tab) => tab.initialClick);
    (_c = initialItem == null ? void 0 : initialItem.onClick) == null ? void 0 : _c.call(initialItem, initialItem);
  }, [isChatBotOpen, tabList]);
  useEffect(() => {
    if (isFullWidth || isCollapsed) return;
    const syncDocked = () => {
      setRect(getDockedRect(panelsOpen));
    };
    syncDocked();
    window.addEventListener("resize", syncDocked);
    return () => {
      window.removeEventListener("resize", syncDocked);
    };
  }, [isFullWidth, isCollapsed, panelsOpen, isChatBotOpen]);
  useEffect(() => {
    if (!isFullWidth) return;
    const onResize = () => {
      setRect(getDefaultRect(true));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isFullWidth]);
  const handleCloseChatBot = () => {
    setIsChatBotOpen(false);
    setIsHistoryPanelOpen(false);
    setIsBookMarkPanelOpen(false);
    setIsPagePanelOpen(false);
    onClose == null ? void 0 : onClose();
  };
  const handleMenuClick = (item) => {
    var _a2, _b, _c;
    if (item.key === "newchat") {
      setInputValue("");
      const tabDetails = handleNewChatClick(item);
      if (tabDetails == null ? void 0 : tabDetails.isInitialClickPresent) {
        const initialClickItem = tabList == null ? void 0 : tabList.find(
          (i) => {
            var _a3, _b2;
            return ((_a3 = i.name) == null ? void 0 : _a3.toLowerCase()) === ((_b2 = tabDetails.tabName) == null ? void 0 : _b2.toLowerCase());
          }
        );
        (_a2 = initialClickItem == null ? void 0 : initialClickItem.onClick) == null ? void 0 : _a2.call(initialClickItem, initialClickItem);
      }
      setActiveList(
        (_b = tabList == null ? void 0 : tabList.find((i) => {
          var _a3, _b2;
          return ((_a3 = i.name) == null ? void 0 : _a3.toLowerCase()) === ((_b2 = tabDetails == null ? void 0 : tabDetails.tabName) == null ? void 0 : _b2.toLowerCase());
        })) == null ? void 0 : _b.name
      );
    } else if (item.key === "history") {
      setIsHistoryPanelOpen(!isHistoryPanelOpen);
      onHistoryPanelClick(item, !isHistoryPanelOpen);
    } else {
      setActiveList(item.key);
      (_c = item.onClick) == null ? void 0 : _c.call(item, item);
    }
  };
  const handleCloseLeftPanel = () => {
    setIsBookMarkPanelOpen(false);
    setIsHistoryPanelOpen(false);
    setIsPagePanelOpen(false);
  };
  return isChatBotOpen ? /* @__PURE__ */ jsx("div", { className: "chatbot-modal-wrapper", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `chatbot-component-container ${isFullWidth ? "full-width" : ""} ${isDragging ? "is-dragging" : ""} ${isResizing ? "is-resizing" : ""} ${isCollapsed ? "is-collapsed" : ""}`,
      style: isFullWidth ? void 0 : {
        position: "fixed",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height
      },
      children: [
        !isFullWidth && resolveDirectionForResize.map((direction) => /* @__PURE__ */ jsx(
          "div",
          {
            "aria-label": `Resize ${direction.toUpperCase()}`,
            className: `resizer resizer-${direction}`,
            ...getResizeHandleProps(direction)
          },
          direction
        )),
        landingScreen ? /* @__PURE__ */ jsx(ChatBotLandingScreen, { isFullWidth, onClose: handleCloseChatBot }) : /* @__PURE__ */ jsxs("div", { className: "chatbot-main-content", children: [
          !isCollapsed && /* @__PURE__ */ jsx(
            "div",
            {
              className: `chatbot-component-left-side ${isBookMarkPanelOpen || isHistoryPanelOpen || isPagePanelOpen ? "chatbot-component-left-side-open" : ""}`,
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `chatbot-component-menu-container ${isBookMarkPanelOpen || isHistoryPanelOpen || isPagePanelOpen ? "chatbot-component-menu-container-open" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `chatbot-component-menu-container-icon ${isBookMarkPanelOpen || isHistoryPanelOpen || isPagePanelOpen ? "chatbot-component-menu-container-icon-open" : ""}`,
                        children: [
                          /* @__PURE__ */ jsx("ul", { className: "chatbot-component-menu-list", children: menuItems$1.map((item) => {
                            var _a2;
                            return /* @__PURE__ */ jsx(
                              Tooltip,
                              {
                                orientation: "left",
                                title: getMenuItemLabel(item, t),
                                variant: "tertiary",
                                children: /* @__PURE__ */ jsx(
                                  "li",
                                  {
                                    className: `${item.className} ${(activeList == null ? void 0 : activeList.toLowerCase()) === ((_a2 = item.key) == null ? void 0 : _a2.toLowerCase()) ? "active" : ""}`,
                                    role: "button",
                                    tabIndex: 0,
                                    onClick: () => {
                                      handleMenuClick(item);
                                    },
                                    onKeyDown: (e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleMenuClick(item);
                                      }
                                    },
                                    children: renderTabIcon(item.icon, item.key, item.iconClassName)
                                  }
                                )
                              },
                              item.key
                            );
                          }) }),
                          /* @__PURE__ */ jsx("ul", { className: "chatbot-component-menu-list utility-list", children: utilityList.map((item) => /* @__PURE__ */ jsx(
                            Tooltip,
                            {
                              orientation: "left",
                              title: getMenuItemLabel(item, t),
                              variant: "tertiary",
                              children: /* @__PURE__ */ jsx(
                                "li",
                                {
                                  role: "button",
                                  tabIndex: 0,
                                  onClick: item.onClick,
                                  onKeyDown: (e) => {
                                    var _a2;
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      (_a2 = item.onClick) == null ? void 0 : _a2.call(item);
                                    }
                                  },
                                  children: renderTabIcon(item.icon, item.key)
                                }
                              )
                            },
                            item.key
                          )) })
                        ]
                      }
                    ),
                    isBookMarkPanelOpen && !isHistoryPanelOpen && !isPagePanelOpen && /* @__PURE__ */ jsx(
                      BookMarkPanel,
                      {
                        addedByYouQuestions,
                        preDefinedQuestions,
                        onClose: handleCloseLeftPanel
                      }
                    ),
                    isHistoryPanelOpen && !isBookMarkPanelOpen && !isPagePanelOpen && /* @__PURE__ */ jsx(
                      HistoryPanel,
                      {
                        activeConversationId,
                        historyPanelData,
                        openGroups: historyOpenGroups ?? localHistoryOpenGroups,
                        onClose: handleCloseLeftPanel,
                        onMenuAction: onHistoryMenuAction,
                        onSearchChange: onHistorySearchChange,
                        onSelectConversation: onHistorySelectConversation,
                        onToggleGroup: (groupName, isOpen) => {
                          if (historyOpenGroups == null) {
                            setLocalHistoryOpenGroups((prev) => ({ ...prev, [groupName]: isOpen }));
                          }
                          onHistoryToggleGroup(groupName, isOpen);
                        }
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `chatbot-component-right-side ${isBookMarkPanelOpen || isHistoryPanelOpen || isPagePanelOpen ? "chatbot-component-right-side-open" : ""}`,
              children: [
                !isCustomScreen && /* @__PURE__ */ jsx("div", { className: "chatbot-header-row", children: /* @__PURE__ */ jsx(
                  ChatbotModuleMenu,
                  {
                    activeList,
                    activeThread,
                    dragHandleProps: headerDragHandleProps,
                    handleCloseThread,
                    handleSavedChat,
                    handleThreadClick,
                    hideCenterOptions: newChatScreen,
                    hideChildren: !newChatScreen,
                    hideMenuArrow,
                    isCollapsed,
                    isFullWidth,
                    isModuleListLoading,
                    moduleList,
                    threadList,
                    onClose: handleCloseChatBot,
                    onMinimiseChatBot,
                    onModuleClick,
                    onToggleCollapse: handleToggleCollapse
                  }
                ) }),
                newChatScreen ? /* @__PURE__ */ jsx(
                  NewChatComponent,
                  {
                    activeList,
                    customInputComponent,
                    footerText: resolvedFooterText,
                    handleMicClick,
                    handleRefresh,
                    handleSaveChat,
                    hideMenuArrow,
                    inputValue,
                    isModuleListLoading,
                    isStopIcon,
                    moduleList,
                    setInputValue,
                    setIsNewChat,
                    setUserChats,
                    showSuggestionBanner,
                    suggestionBanner: resolvedSuggestionBanner,
                    userChats,
                    userName,
                    onClose: handleCloseChatBot,
                    onCloseSuggestionBanner,
                    onModuleClick,
                    onSendIconClick,
                    onStopIconClick
                  }
                ) : isCustomScreen ? /* @__PURE__ */ jsx(
                  CustomScreen,
                  {
                    activeList,
                    customInputComponent,
                    customScreenJsx,
                    footerText: resolvedFooterText,
                    handleMicClick,
                    handleRefresh,
                    handleSaveChat,
                    isFullWidth,
                    isStopIcon,
                    setUserChats,
                    showSuggestionBanner,
                    suggestionBanner: resolvedSuggestionBanner,
                    userChats,
                    onClose: handleCloseChatBot,
                    onCloseSuggestionBanner,
                    onMinimiseChatBot,
                    onSendIconClick,
                    onStopIconClick
                  }
                ) : /* @__PURE__ */ jsx(
                  ConversationScreen,
                  {
                    activeList,
                    conversation: conversation ?? {},
                    customInputComponent,
                    footerText: resolvedFooterText,
                    handleMicClick,
                    handleRefresh,
                    handleSaveChat,
                    inputText,
                    isAssistantThinking,
                    isCollapsed,
                    isStopIcon,
                    setUserChats,
                    showSuggestionBanner,
                    suggestionBanner: resolvedSuggestionBanner,
                    userChats,
                    onCloseSuggestionBanner,
                    onDislikeClick,
                    onLikeClick,
                    onSendIconClick,
                    onStopIconClick
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  ) }) : null;
}
ChatBotComponent.displayName = "ChatBotComponent";
export {
  ChatBotComponent
};
