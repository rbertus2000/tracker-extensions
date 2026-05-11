"use strict";var source=(()=>{var k=Object.defineProperty;var Pe=Object.getOwnPropertyDescriptor;var Te=Object.getOwnPropertyNames;var we=Object.prototype.hasOwnProperty;var Re=(i,t,e)=>t in i?k(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var Le=(i,t)=>{for(var e in t)k(i,e,{get:t[e],enumerable:!0})},Ce=(i,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Te(t))!we.call(i,o)&&o!==e&&k(i,o,{get:()=>t[o],enumerable:!(s=Pe(t,o))||s.enumerable});return i};var Oe=i=>Ce(k({},"__esModule",{value:!0}),i);var l=(i,t,e)=>Re(i,typeof t!="symbol"?t+"":t,e);var Me={};Le(Me,{AniList:()=>De,AniListExtension:()=>M});var S=class{constructor(){l(this,"requiresExplicitSubmission",!1)}reloadForm(){let t=this.__underlying_formId;t&&Application.formDidChange(t)}};function ee(i,t,e){return i["__closure_selector-"+t]=e,Application.Selector(i,"__closure_selector-"+t)}function p(i,t){let e;return typeof i=="string"?e={id:i}:e=i,{type:"listSection",...e,items:t.filter(s=>s),allowAddition:!1,allowDeletion:!1,allowReorder:!1}}function ce(i,t){let e;return typeof i=="string"?e={id:i}:e=i,{type:"flowSection",...e,items:t.filter(s=>s)}}function F(i,t){if(t.maxItemCount<1)throw new Error(`[${t.id}] maxItemCount must not be less than one`);if(t.minItemCount<0)throw new Error(`[${t.id}] minItemCount must not be less than zero`);if(t.minItemCount>=t.maxItemCount&&t.maxItemCount>1)throw new Error(`[${t.id}] minItemCount must be less than maxItemCount, or both must be one`);if(t.value.length<t.minItemCount)throw new Error(`[${t.id}] value count must not be less than minItemCount`);if(!t.value.every(s=>t.items.some(o=>o.id===s)))throw new Error(`[${t.id}] All provided values must be inside items`);let e=Object.keys(t.value).length;return(t.layout=="flow"?ce:p)({id:t.id,header:t.header,footer:t.footer},t.items.map(s=>{let o=t.value.indexOf(s.id),n=o!==-1;return f(s.id,{title:s.title,value:n?{symbol:"checkmark",style:"success"}:void 0,onSelect:ee(i,`__select_${t.id}#${s.id}`,async()=>{if(n)e>t.minItemCount&&t.value.splice(o,1);else if(t.maxItemCount==1)t.value.splice(0,t.value.length,s.id);else if(e<t.maxItemCount)t.value.push(s.id);else return;t.onValueChange&&await Application.SelectorRegistry.selector(t.onValueChange)(),i.reloadForm()})})}))}function v(i,t){let e=Object.keys(t.value).length;return(t.layout=="flow"?ce:p)({id:t.id,header:t.header,footer:t.footer},t.items.map(s=>{let o=t.value[s.id],n,d;switch(o){case"included":{t.layout=="flow"?(d="success",n=void 0):(d=void 0,n={symbol:"checkmark",style:"success"});break}case"excluded":{t.layout=="flow"?(d="error",n=void 0):(d=void 0,n={symbol:"xmark",style:"error"});break}default:{n=void 0,d=void 0;break}}return f(s.id,{style:d,title:s.title,value:n,onSelect:ee(i,`__multiselect_${t.id}#${s.id}`,async()=>{let r,a=!t.maximum||e<t.maximum,u=t.allowEmptySelection&&e==1||e>1;switch(o){case"included":{if(t.allowExclusion){r="excluded";break}if(u){r=void 0;break}else return}case"excluded":if(u){r=void 0;break}else return;case void 0:if(a){r="included";break}else return}r==null?delete t.value[s.id]:t.value[s.id]=r,t.onValueChange&&await Application.SelectorRegistry.selector(t.onValueChange)(),i.reloadForm()})})}))}function f(i,t){return{...t,id:i,type:"labelRow",isHidden:t.isHidden??!1,isSelectable:t.onSelect!=null}}function P(i,t){return{...t,id:i,type:"inputRow",isHidden:t.isHidden??!1}}function R(i,t){return{...t,id:i,type:"stepperRow",isHidden:t.isHidden??!1}}function L(i,t){return{...t,id:i,type:"toggleRow",isHidden:t.isHidden??!1}}function G(i,t){return T(i,{form:new te(t.title,t),title:t.title,subtitle:t.subtitle,value:`${Object.keys(t.value).length} items`,isHidden:t.isHidden})}function se(i,t){return T(i,{form:new ie(t.title,t),title:t.title,value:`${Object.keys(t.value).length} items`,isHidden:t.isHidden})}function $(i,t){return{...t,id:i,type:"buttonRow",isHidden:t.isHidden??!1}}function T(i,t){return{...t,id:i,type:"navigationRow",isHidden:t.isHidden??!1}}function pe(i,t){return{...t,id:i,type:"oauthButtonRow",isHidden:t.isHidden??!1}}var te=class extends S{constructor(e,s){super();l(this,"title");l(this,"params");l(this,"states",[]);l(this,"requiresExplicitSubmission",!0);this.title=e,this.params=s,this.states=[...s.value]}getSections(){return[F(this,{id:"select",value:this.states,layout:"layout"in this.params?this.params.layout:"list",items:"items"in this.params?this.params.items:this.params.options,minItemCount:this.params.minItemCount,maxItemCount:this.params.maxItemCount,isHidden:this.params.isHidden})]}async formDidSubmit(){await Application.SelectorRegistry.selector(this.params.onValueChange)(this.states)}},ie=class extends S{constructor(e,s){super();l(this,"title");l(this,"params");l(this,"states",{});l(this,"requiresExplicitSubmission",!0);this.title=e,this.params=s,this.states={...s.value}}getSections(){return[v(this,{id:"multiselect",value:this.states,items:this.params.items,allowExclusion:this.params.allowExclusion,allowEmptySelection:this.params.allowEmptySelection,maximum:this.params.maximum,layout:this.params.layout})]}async formDidSubmit(){await Application.SelectorRegistry.selector(this.params.onValueChange)(this.states)}};var U=class extends S{constructor(){super(...arguments);l(this,"requiresExplicitSubmission",!0)}async formDidSubmit(){}formDidCancel(){}};var A=class{constructor(t){l(this,"id");this.id=t}registerInterceptor(){Application.registerInterceptor(this.id,Application.Selector(this,"interceptRequest"),Application.Selector(this,"interceptResponse"))}unregisterInterceptor(){Application.unregisterInterceptor(this.id)}};var H={},re={},oe=async i=>{if(H[i]){await H[i],await oe(i);return}H[i]=new Promise(t=>re[i]=()=>{delete H[i],t()})},me=i=>{re[i]&&re[i]()};var j=class extends A{constructor(e,s){super(e);l(this,"options");l(this,"promise");l(this,"currentRequestsMade",0);l(this,"lastReset",Date.now());l(this,"imageRegex",new RegExp(/\.(avif|gif|jpeg|jpg|jxl|png|webp)(\?|$)/i));this.options=s}async interceptRequest(e){return this.options.ignoreImages&&this.imageRegex.test(e.url)||(await oe(this.id),await this.incrementRequestCount(),me(this.id)),e}async interceptResponse(e,s,o){return o}async incrementRequestCount(){if(await this.promise,(Date.now()-this.lastReset)/1e3>this.options.bufferInterval&&(this.currentRequestsMade=0,this.lastReset=Date.now()),this.currentRequestsMade+=1,this.currentRequestsMade>=this.options.numberOfRequests){let s=(Date.now()-this.lastReset)/1e3;if(s<=this.options.bufferInterval){let o=this.options.bufferInterval-s;console.log(`[BasicRateLimiter] rate limit hit, sleeping for ${o}`),this.promise=Application.sleep(o)}}}};var ge;(function(i){i[i.NONE=0]="NONE",i[i.MANGA_CHAPTERS=1]="MANGA_CHAPTERS",i[i.CHAPTER_PROVIDING=1]="CHAPTER_PROVIDING",i[i.MANGA_PROGRESS=2]="MANGA_PROGRESS",i[i.MANGA_PROGRESS_PROVIDING=2]="MANGA_PROGRESS_PROVIDING",i[i.PROGRESS_PROVIDING=2]="PROGRESS_PROVIDING",i[i.DISCOVER_SECIONS=4]="DISCOVER_SECIONS",i[i.DISCOVER_SECIONS_PROVIDING=4]="DISCOVER_SECIONS_PROVIDING",i[i.DISCOVER_SECTION_PROVIDING=4]="DISCOVER_SECTION_PROVIDING",i[i.COLLECTION_MANAGEMENT=8]="COLLECTION_MANAGEMENT",i[i.MANAGED_COLLECTION_PROVIDING=8]="MANAGED_COLLECTION_PROVIDING",i[i.CLOUDFLARE_BYPASS_REQUIRED=16]="CLOUDFLARE_BYPASS_REQUIRED",i[i.CLOUDFLARE_BYPASS_PROVIDING=16]="CLOUDFLARE_BYPASS_PROVIDING",i[i.SETTINGS_UI=32]="SETTINGS_UI",i[i.SETTINGS_FORM_PROVIDING=32]="SETTINGS_FORM_PROVIDING",i[i.MANGA_SEARCH=64]="MANGA_SEARCH",i[i.SEARCH_RESULTS_PROVIDING=64]="SEARCH_RESULTS_PROVIDING",i[i.SEARCH_RESULT_PROVIDING=64]="SEARCH_RESULT_PROVIDING"})(ge||(ge={}));var b;(function(i){i.EVERYONE="SAFE",i.MATURE="MATURE",i.ADULT="ADULT"})(b||(b={}));var E;(function(i){i[i.featured=0]="featured",i[i.simpleCarousel=1]="simpleCarousel",i[i.prominentCarousel=2]="prominentCarousel",i[i.chapterUpdates=3]="chapterUpdates",i[i.genres=4]="genres"})(E||(E={}));var Wt=Object.freeze({items:[],metadata:void 0});var q=`
query Query(
  $page: Int
  $isAdult: Boolean
  $onList: Boolean
  $countryOfOrigin: CountryCode
  $isLicensed: Boolean
  $search: String
  $startDateGreater: FuzzyDateInt
  $startDateLesser: FuzzyDateInt
  $formatIn: [MediaFormat]
  $formatNotIn: [MediaFormat]
  $statusIn: [MediaStatus]
  $statusNotIn: [MediaStatus]
  $chaptersGreater: Int
  $chaptersLesser: Int
  $volumesGreater: Int
  $volumesLesser: Int
  $genreIn: [String]
  $genreNotIn: [String]
  $tagIn: [String]
  $tagNotIn: [String]
  $sourceIn: [MediaSource]
  $sort: [MediaSort]
) {
  Page(page: $page, perPage: 50) {
    pageInfo {
      hasNextPage
    }
    media(
      type: MANGA
      isAdult: $isAdult
      onList: $onList
      countryOfOrigin: $countryOfOrigin
      isLicensed: $isLicensed
      search: $search
      startDate_greater: $startDateGreater
      startDate_lesser: $startDateLesser
      format_in: $formatIn
      format_not_in: $formatNotIn
      status_in: $statusIn
      status_not_in: $statusNotIn
      chapters_greater: $chaptersGreater
      chapters_lesser: $chaptersLesser
      volumes_greater: $volumesGreater
      volumes_lesser: $volumesLesser
      genre_in: $genreIn
      genre_not_in: $genreNotIn
      tag_in: $tagIn
      tag_not_in: $tagNotIn
      source_in: $sourceIn
      sort: $sort
    ) {
      chapters
      coverImage {
        extraLarge
        large
        medium
      }
      format
      genres
      id
      isAdult
      status
      title {
        english
        native
        romaji
      }
      volumes
      synonyms
    }
  }
}
`;var C={JP:{id:"JP",label:"Japan"},KR:{id:"KR",label:"South Korea"},CN:{id:"CN",label:"China"},TW:{id:"TW",label:"Taiwan"}},y={MANGA:{id:"MANGA",label:"Manga"},NOVEL:{id:"NOVEL",label:"Novel"},ONE_SHOT:{id:"ONE_SHOT",label:"One Shot"}},m={FINISHED:{id:"FINISHED",label:"Finished"},RELEASING:{id:"RELEASING",label:"Releasing"},NOT_YET_RELEASED:{id:"NOT_YET_RELEASED",label:"Not Yet Released"},CANCELLED:{id:"CANCELLED",label:"Cancelled"},HIATUS:{id:"HIATUS",label:"Hiatus"}},I={SEARCH_MATCH:{id:"SEARCH_MATCH",label:"Search Match"},ID:{id:"ID",label:"Id \u2191"},ID_DESC:{id:"ID_DESC",label:"Id \u2193"},TITLE_ROMAJI:{id:"TITLE_ROMAJI",label:"Title Romaji \u2191"},TITLE_ROMAJI_DESC:{id:"TITLE_ROMAJI_DESC",label:"Title Romaji \u2193"},TITLE_ENGLISH:{id:"TITLE_ENGLISH",label:"Title English \u2191"},TITLE_ENGLISH_DESC:{id:"TITLE_ENGLISH_DESC",label:"Title English \u2193"},TITLE_NATIVE:{id:"TITLE_NATIVE",label:"Title Native \u2191"},TITLE_NATIVE_DESC:{id:"TITLE_NATIVE_DESC",label:"Title Native \u2193"},FORMAT:{id:"FORMAT",label:"Format \u2191"},FORMAT_DESC:{id:"FORMAT_DESC",label:"Format \u2193"},START_DATE:{id:"START_DATE",label:"Start Date \u2191"},START_DATE_DESC:{id:"START_DATE_DESC",label:"Start Date \u2193"},END_DATE:{id:"END_DATE",label:"End Date \u2191"},END_DATE_DESC:{id:"END_DATE_DESC",label:"End Date \u2193"},SCORE:{id:"SCORE",label:"Score \u2191"},SCORE_DESC:{id:"SCORE_DESC",label:"Score \u2193"},POPULARITY:{id:"POPULARITY",label:"Popularity \u2191"},POPULARITY_DESC:{id:"POPULARITY_DESC",label:"Popularity \u2193"},TRENDING:{id:"TRENDING",label:"Trending \u2191"},TRENDING_DESC:{id:"TRENDING_DESC",label:"Trending \u2193"},STATUS:{id:"STATUS",label:"Status \u2191"},STATUS_DESC:{id:"STATUS_DESC",label:"Status \u2193"},CHAPTERS:{id:"CHAPTERS",label:"Chapters \u2191"},CHAPTERS_DESC:{id:"CHAPTERS_DESC",label:"Chapters \u2193"},VOLUMES:{id:"VOLUMES",label:"Volumes \u2191"},VOLUMES_DESC:{id:"VOLUMES_DESC",label:"Volumes \u2193"},UPDATED_AT:{id:"UPDATED_AT",label:"Updated At \u2191"},UPDATED_AT_DESC:{id:"UPDATED_AT_DESC",label:"Updated At \u2193"},FAVOURITES:{id:"FAVOURITES",label:"Favourites \u2191"},FAVOURITES_DESC:{id:"FAVOURITES_DESC",label:"Favourites \u2193"}};var ne={ORIGINAL:{id:"ORIGINAL",label:"Original"},MANGA:{id:"MANGA",label:"Manga"},LIGHT_NOVEL:{id:"LIGHT_NOVEL",label:"Light Novel"},WEB_NOVEL:{id:"WEB_NOVEL",label:"Web Novel"},NOVEL:{id:"NOVEL",label:"Novel"},Anime:{id:"ANIME",label:"Anime"},VISUAL_NOVEL:{id:"VISUAL_NOVEL",label:"Visual Novel"},VIDEO_GAME:{id:"VIDEO_GAME",label:"Video Game"},DOUJINSHI:{id:"DOUJINSHI",label:"Doujinshi"},COMIC:{id:"COMIC",label:"Comic"},LIVE_ACTION:{id:"LIVE_ACTION",label:"Live Action"},GAME:{id:"GAME",label:"Game"},MULTIMEDIA_PROJECT:{id:"MULTIMEDIA_PROJECT",label:"Multimedia Project"},PICTURE_BOOK:{id:"PICTURE_BOOK",label:"Picture Book"},OTHER:{id:"OTHER",label:"Other"}};var ae=`
query Query {
  Viewer {
    avatar {
      large
    }
    createdAt
    id
    name
    mediaListOptions {
      rowOrder
      scoreFormat
      mangaList {
        advancedScoringEnabled
        advancedScoring
        customLists
        splitCompletedSectionByFormat
        sectionOrder
      }
    }
    options {
      activityMergeTime
      disabledListActivity {
        disabled
        type
      }
      displayAdultContent
      staffNameLanguage
      titleLanguage
    }
  }
}
`;var Ne="https://graphql.anilist.co";async function h(i,t,e){let s={url:Ne,method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:i,variables:e})};if(t){let u=String(Application.getSecureState("session"));if(u==null)throw new Error("You are not authenticated, please log in through the AniList settings");let c=JSON.parse(Application.base64Decode(u.split(".")[1]));if(Number(c.exp)<new Date().valueOf()/1e3)throw Application.setSecureState(null,"session"),Application.setState(null,"viewer-id"),Application.setState(null,"viewer-advanced-scoring"),Application.setState(null,"viewer-list-order"),Application.setState(null,"viewer-custom-lists"),Application.setState(null,"viewer-split-completed-list-by-format"),Application.setState(null,"viewer-advanced-scoring-enabled"),new Error("Your authorization token has expired, please log back in through the AniList settings");s.headers.Authorization="Bearer "+u}let[o,n]=await Application.scheduleRequest(s),d=Application.arrayBufferToUTF8String(n),r=JSON.parse(d);if(r==null||typeof r!="object"||!("data"in r||"error"in r))throw new Error(`Failed to parse JSON object: ${String(r)}`);let a=r;if(a.errors!=null){let u="";for(let c=0;c<a.errors.length;c++)c!=0&&(u+=`
`),u+=`AniList returned an error: [${a.errors[c].status}] ${a.errors[c].message}`;throw new Error(u)}return a.data}function O(){return Application.getState("setting-synonyms-in-titles")}var Q=class extends S{getSections(){return Application.getSecureState("session")==null?[p("no-session",[this.loginButton()])]:[p("session",[this.profileViewNavigation(),this.logOutButton()]),p("settings",[this.synonymsToggle()])]}loginButton(){let t={title:"Log In",subtitle:"Log in to AniList to automatically sync your library and reading progress.",onSuccess:Application.Selector(this,"handleLoginSuccess"),authorizeEndpoint:"https://anilist.co/api/v2/oauth/authorize?client_id=6621&response_type=token",responseType:{type:"token"},clientId:"6621"};return pe("login",t)}profileViewNavigation(){let t={title:"View Profile",form:new le};return T("profile-view",t)}logOutButton(){let t={title:"Log Out",onSelect:Application.Selector(this,"logOut")};return $("log-out",t)}synonymsToggle(){let t={title:"Display title synonyms if the title is not in English",value:O()??!1,onValueChange:Application.Selector(this,"handleSynonymsToggle")};return L("synonyms",t)}async handleSynonymsToggle(t){Application.setState(t,"setting-synonyms-in-titles"),Application.invalidateDiscoverSections(),this.reloadForm()}async handleLoginSuccess(t){Application.setSecureState(t,"session");let e=await h(ae,!0);Application.setState(e.Viewer.id,"viewer-id"),Application.setState(JSON.stringify(e.Viewer.mediaListOptions.mangaList.advancedScoring),"viewer-advanced-scoring"),Application.setState(JSON.stringify(e.Viewer.mediaListOptions.mangaList.sectionOrder),"viewer-list-order"),Application.setState(JSON.stringify(e.Viewer.mediaListOptions.mangaList.customLists),"viewer-custom-lists"),Application.setState(String(e.Viewer.mediaListOptions.mangaList.splitCompletedSectionByFormat),"viewer-split-completed-list-by-format"),Application.setState(String(e.Viewer.mediaListOptions.mangaList.advancedScoringEnabled),"viewer-advanced-scoring-enabled"),this.reloadForm()}async logOut(){Application.setSecureState(null,"session"),Application.setState(null,"viewer-id"),Application.setState(null,"viewer-advanced-scoring"),Application.setState(null,"viewer-list-order"),Application.setState(null,"viewer-custom-lists"),Application.setState(null,"viewer-split-completed-list-by-format"),Application.setState(null,"viewer-advanced-scoring-enabled"),this.reloadForm()}},le=class extends S{constructor(){super(...arguments);l(this,"loadRequest");l(this,"viewer");l(this,"error")}formWillAppear(){this.loadRequest=h(ae,!0).then(e=>{this.viewer=e}).catch(e=>{this.error=e}).finally(()=>{this.reloadForm()})}getSections(){return this.viewer==null&&this.error==null?[p("loading",[f("loading",{title:"Loading..."})])]:this.error!=null?[p("error",[f("error",{title:"Error",subtitle:this.error.toString()})])]:[this.getProfileSection(this.viewer),this.getSessionSection()]}getProfileSection(e){let s=new Date(0);s.setUTCSeconds(e.Viewer.createdAt);let o=[f("username-id",{title:"Username",value:e.Viewer.name,subtitle:"Id: "+e.Viewer.id.toString()}),f("creation-date",{title:"Creation Date",value:s.toLocaleString()})];return p({id:"profile-data",header:"Profile"},o)}getSessionSection(){let e=String(Application.getSecureState("session")),s=JSON.parse(Application.base64Decode(e.split(".")[1])),o=[];for(let[n,d]of Object.entries(s)){let r={title:n};n=="jti"?r.subtitle=String(d):r.value=String(d)||"Undefined",o.push(f(n,r))}return p({id:"session-data",header:"Session"},o)}};async function B(i,t,e,s){let o=[],n=await h(i,e,t),d=n.Page.media;for(let r of d){let a="";switch(r.format){case"NOVEL":a+="("+y.NOVEL.label+") ";break;case"ONE_SHOT":a+="("+y.ONE_SHOT.label+") "}a+=r.title.english??r.title.romaji??r.title.native??"No Title",O()==!0&&r.synonyms.length>0&&!r.title.english&&(a+=" / "+r.synonyms[0]);let u=r.isAdult?b.ADULT:r.genres.some(V=>V=="ecchi")?b.MATURE:b.EVERYONE,c;switch(r.status){case m.FINISHED.id:{if(!r.chapters&&!r.volumes){c=m.FINISHED.label;break}c=[r.chapters?"Chs. "+r.chapters.toString():"",r.volumes?"Vols. "+r.volumes.toString():""].join(" ");break}case m.NOT_YET_RELEASED.id:c=m.NOT_YET_RELEASED.label;break;case m.CANCELLED.id:c=m.CANCELLED.label;break;case m.HIATUS.id:c=m.HIATUS.label;break;case m.RELEASING.id:c=m.RELEASING.label}o.push({mangaId:r.id.toString(),title:a,imageUrl:r.coverImage.large,contentRating:u,subtitle:c})}return s=n.Page.pageInfo.hasNextPage?(s??1)+1:void 0,{items:o,metadata:s}}function he(i,t){t.forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(s=>{Object.defineProperty(i.prototype,s,Object.getOwnPropertyDescriptor(e.prototype,s)||Object.create(null))})})}var Y=class{async getDiscoverSections(){let t={id:"trending-now",title:"Trending Now",type:E.featured},e={id:"all-time-popular",title:"All Time Popular",type:E.prominentCarousel},s={id:"popular-manga",title:"Popular Manga",type:E.simpleCarousel},o={id:"popular-manhwa",title:"Popular Manhwa",type:E.simpleCarousel},n={id:"top-100-manga",title:"Top 100 Manga",type:E.prominentCarousel};return[t,e,s,o,n]}async getDiscoverSectionItems(t,e){let s,o;switch(t.id){case"trending-now":s=I.TRENDING_DESC.id;break;case"all-time-popular":s=I.POPULARITY_DESC.id;break;case"popular-manga":s=I.POPULARITY_DESC.id,o=C.JP.id;break;case"popular-manhwa":s=I.POPULARITY_DESC.id,o=C.KR.id;break;case"top-100-manga":s=I.SCORE_DESC.id;break}return B(q,{page:e??1,sort:s,countryOfOrigin:o},!1,e)}};var fe=`
query Query($id: Int) {
  Media(id: $id) {
    averageScore
    bannerImage
    coverImage {
      extraLarge
      large
      medium
    }
    description
    format
    genres
    isAdult
    staff {
      edges {
        node {
          name {
            full
          }
        }
        role
      }
    }
    status
    tags {
      id
      name
    }
    title {
      english
      native
      romaji
    }
    synonyms
  }
}
`;var w=class{async getMangaDetails(t){let e={id:Number(t)},o=(await h(fe,!1,e)).Media,n=o.description?o.description.replaceAll(/<br>|<i>|<\/i>|<a.*?>|<\/a>/g,""):"No description";n+=o.synonyms.length>0?`

Synonyms: `+o.synonyms.toLocaleString().replaceAll(",",", ")+`

`:"";let d=[];for(let g of Object.values(o.title))g!=null&&d.push(g);for(let g of o.synonyms)d.push(g);let r=o.title.english??o.title.romaji??o.title.native??"No Title";O()==!0&&o.synonyms.length>0&&!o.title.english&&(r+=`
`+o.synonyms[0]);let a;switch(o.status){case m.FINISHED.id:a=m.FINISHED.label;break;case m.NOT_YET_RELEASED.id:a=m.NOT_YET_RELEASED.label;break;case m.CANCELLED.id:a=m.CANCELLED.label;break;case m.HIATUS.id:a=m.HIATUS.label;break;case m.RELEASING.id:a=m.RELEASING.label}let u,c;for(let g of o.staff.edges){if(g.role.startsWith("Story & Art")){u=g.node.name.full,c=void 0;break}if(!u&&(g.role.startsWith("Story")||g.role.startsWith("Original Story"))&&(u=g.node.name.full,u&&c)||g.role.startsWith("Art")&&(c=g.node.name.full,u&&c))break}let V=o.averageScore?o.averageScore/100:void 0,_=[];for(let g of o.genres)_.push({id:g.replaceAll(" ","_").toLowerCase(),title:g});let Ie=[];for(let g of o.tags)_.push({id:g.id.toString().replaceAll(" ","_").toLowerCase(),title:g.name});let Ee=[{id:"genres",title:"Genres",tags:_},{id:"tags",title:"Tags",tags:Ie}],Ae=o.isAdult?b.ADULT:_.some(g=>g.id=="ecchi")?b.MATURE:b.EVERYONE,ue=[o.coverImage.extraLarge];o.bannerImage!=null&&ue.push(o.bannerImage);let ve={Format:o.format==y.MANGA.id?y.MANGA.label:o.format==y.NOVEL.id?y.NOVEL.label:y.ONE_SHOT.label};return{mangaId:t,mangaInfo:{thumbnailUrl:o.coverImage.extraLarge,synopsis:n,primaryTitle:r,secondaryTitles:d,contentRating:Ae,status:a,artist:c,author:u,bannerUrl:o.bannerImage??void 0,rating:V,tagGroups:Ee,artworkUrls:ue,shareUrl:"https://anilist.co/manga/"+t,additionalInfo:ve}}}};var x=`
query Query($userId: Int, $mediaId: Int) {
  MediaList(userId: $userId, mediaId: $mediaId) {
    advancedScores
    completedAt {
      day
      month
      year
    }
    createdAt
    customLists
    hiddenFromStatusLists
    id
    notes
    private
    progress
    progressVolumes
    repeat
    score
    startedAt {
      day
      month
      year
    }
    status
    updatedAt
  }
}
`,N={CURRENT:{id:"CURRENT",label:"Reading"},PLANNING:{id:"PLANNING",label:"Planning"},COMPLETED:{id:"COMPLETED",label:"Completed"},DROPPED:{id:"DROPPED",label:"Dropped"},PAUSED:{id:"PAUSED",label:"Paused"},REPEATING:{id:"REPEATING",label:"Rereading"}},J=`
mutation Mutation(
  $id: Int
  $mediaId: Int
  $status: MediaListStatus
  $score: Float
  $progress: Int
  $progressVolumes: Int
  $repeat: Int
  $private: Boolean
  $notes: String
  $hiddenFromStatusLists: Boolean
  $customLists: [String]
  $advancedScores: [Float]
) {
  SaveMediaListEntry(
    id: $id
    mediaId: $mediaId
    status: $status
    score: $score
    progress: $progress
    progressVolumes: $progressVolumes
    repeat: $repeat
    private: $private
    notes: $notes
    hiddenFromStatusLists: $hiddenFromStatusLists
    customLists: $customLists
    advancedScores: $advancedScores
  ) {
    advancedScores
    completedAt {
      day
      month
      year
    }
    createdAt
    customLists
    hiddenFromStatusLists
    id
    notes
    private
    progress
    progressVolumes
    repeat
    score
    startedAt {
      day
      month
      year
    }
    status
    updatedAt
  }
}
`,Se=`
mutation Mutation($deleteMediaListEntryId: Int) {
  DeleteMediaListEntry(id: $deleteMediaListEntryId) {
    deleted
  }
}
`;var z=class extends S{constructor(e,s){super();l(this,"viewerId");l(this,"sourceMangaId");l(this,"loadRequest");l(this,"titleProgress");l(this,"error");l(this,"requiresExplicitSubmission",!0);this.viewerId=e,this.sourceMangaId=s}formWillAppear(){let e={userId:this.viewerId,mediaId:this.sourceMangaId};this.loadRequest=h(x,!0,e).then(s=>{this.titleProgress||(this.titleProgress=s)}).catch(s=>{s?.toString().includes("[404]")||(this.error=s);let n={MediaList:{advancedScores:{},completedAt:{day:null,month:null,year:null},createdAt:Date.now()/1e3,customLists:{},hiddenFromStatusLists:!1,notes:null,private:!1,progress:0,progressVolumes:0,repeat:0,score:0,startedAt:{day:null,month:null,year:null},status:"CURRENT",updatedAt:Date.now()/1e3}};this.titleProgress||(this.titleProgress=n)}).finally(()=>{this.reloadForm()})}async formDidSubmit(){if(this.titleProgress==null)return;let e=this.titleProgress.MediaList,s={userId:this.viewerId,mediaId:this.sourceMangaId,status:e.status,score:e.score,progress:e.progress,progressVolumes:e.progressVolumes,repeat:e.repeat,private:e.private,notes:e.notes,hiddenFromStatusLists:e.hiddenFromStatusLists};await h(J,!0,s)}formDidCancel(){}getSections(){let e=[];if(this.titleProgress==null&&this.error==null)return[p("loading",[f("loading",{title:"Loading..."})])];if(this.error!=null)return[p("error",[f("error",{title:"Error",subtitle:this.error.toString()})])];let s=this.titleProgress.MediaList;s.id==null&&e.push(this.getNewMediaListEntrySection());let o=[...this.getProgressSections(),...this.getScoreSections(),this.getPrivacySection(),this.getNotesSection()];for(let n of o)e.push(n);return s.id!=null&&e.push(this.getDeleteSection()),e}getNewMediaListEntrySection(){return p("newMediaListEntry",[f("newMediaListEntry",{title:"New Media List Entry",subtitle:"Selecting Done will add this item to your media list"})])}getProgressSections(){let e=this.titleProgress.MediaList,s=[];for(let a of Object.keys(N)){let u=N[a];s.push({id:u.id,title:u.label})}let o={title:"Status",value:[e.status.toString()],minItemCount:1,maxItemCount:1,options:s,onValueChange:Application.Selector(this,"statusUpdate")},n={title:"Chapters",subtitle:"The highest read chapter number",value:e.progress,minValue:0,maxValue:99999,stepValue:1,loopOver:!1,onValueChange:Application.Selector(this,"chapterProgressUpdate")},d={title:"Volumes",subtitle:"The highest read volume number",value:e.progressVolumes,minValue:0,maxValue:99999,stepValue:1,loopOver:!1,onValueChange:Application.Selector(this,"volumeProgressUpdate")},r={title:"Reread Count",subtitle:"The amount of times you have reread the title",value:e.repeat,minValue:0,maxValue:99999,stepValue:1,loopOver:!1,onValueChange:Application.Selector(this,"rereadCountUpdate")};return[p({id:"progress",header:"Progress"},[G("status",o),R("chapterProgress",n),R("volumeProgress",d),R("rereadCount",r)])]}async statusUpdate(e){this.titleProgress.MediaList.status=e[0]}async chapterProgressUpdate(e){this.titleProgress.MediaList.progress=e,this.reloadForm()}async volumeProgressUpdate(e){this.titleProgress.MediaList.progressVolumes=e,this.reloadForm()}async rereadCountUpdate(e){this.titleProgress.MediaList.repeat=e,this.reloadForm()}getScoreSections(){let e={title:"Score",subtitle:"",value:this.titleProgress.MediaList.score,minValue:0,maxValue:10,stepValue:.1,loopOver:!1,onValueChange:Application.Selector(this,"scoreUpdate")};return[p({id:"score",header:"Score"},[R("score",e)])]}async scoreUpdate(e){this.titleProgress.MediaList.score=Number(e.toFixed(1)),this.reloadForm()}getPrivacySection(){let e=this.titleProgress.MediaList,s={title:"Private",value:e.private,onValueChange:Application.Selector(this,"privateUpdate")},o={title:"Hidden From Status Lists",value:e.hiddenFromStatusLists,onValueChange:Application.Selector(this,"hiddenFromStatusListsUpdate")},n=[L("private",s),L("hiddenFromStatusLists",o)];return p({id:"privacy",header:"Privacy"},n)}async privateUpdate(e){this.titleProgress.MediaList.private=e}async hiddenFromStatusListsUpdate(e){this.titleProgress.MediaList.hiddenFromStatusLists=e}getNotesSection(){let e={title:"Notes",value:this.titleProgress.MediaList.notes??"",onValueChange:Application.Selector(this,"updateNotes")};return p({id:"notes",header:"Notes",footer:"Only you can see your notes"},[P("notes",e)])}async updateNotes(e){this.titleProgress.MediaList.notes=e}getDeleteSection(){let e={title:"Delete",form:new de(this.titleProgress.MediaList.id)};return p({id:"delete",footer:"Delete the title from your media list"},[T("delete",e)])}},de=class extends S{constructor(e){super();l(this,"mediaListId");this.mediaListId=e}getSections(){if(this.mediaListId==null)return[p("deleted",[f("deleted",{title:"Deleted",subtitle:"The title has been succesfully deleted from your media list"})])];let e={title:"Delete",onSelect:Application.Selector(this,"onDeletion")};return[p({id:"delete",footer:"WARNING: All media list data will be deleted, this action can not be undone"},[$("delete",e)])]}async onDeletion(){let e={deleteMediaListEntryId:this.mediaListId};(await h(Se,!0,e)).DeleteMediaListEntry.deleted&&(this.mediaListId=null,this.reloadForm())}};var W=class{async getMangaProgressManagementForm(t){let e=Number(Application.getState("viewer-id"));if(isNaN(e))throw new Error("You are not authenticated, please log in through the AniList settings");return new z(e,Number(t.mangaId))}async getMangaProgress(t){let e=Number(Application.getState("viewer-id"));if(isNaN(e))throw new Error("You are not authenticated, please log in through the AniList settings");let s={userId:e,mediaId:Number(t.mangaId)},o;try{o=(await h(x,!0,s)).MediaList}catch(a){if(!a?.toString().includes("[404]"))throw a;return}let n={chapterId:String(o.progress),sourceManga:t,langCode:"unknown",chapNum:o.progress,volume:o.progressVolumes},d=new Date(0);return d.setUTCSeconds(o.updatedAt),{sourceManga:t,lastReadChapter:n,lastReadTime:d,userRating:o.score}}async processChapterReadActionQueue(t){let e=Number(Application.getState("viewer-id")),s={successfulItems:[],failedItems:[]};if(isNaN(e))return s;let o=new Map;for(let n of t)(o.get(n.sourceManga.mangaId)??0)<Math.floor(n.chapterNum)&&o.set(n.sourceManga.mangaId,Math.floor(n.chapterNum));for(let n of t){if((o.get(n.sourceManga.mangaId)??0)!=Math.floor(n.chapterNum)){s.successfulItems.push(n.id);continue}try{let d={userId:e,mediaId:Number(n.sourceManga.mangaId)},r;try{r=(await h(x,!0,d)).MediaList}catch(u){if(!u?.toString().includes("[404]")){s.failedItems.push(n.id);continue}}if(r?.progress&&r.progress>=n.chapterNum){s.successfulItems.push(n.id);continue}let a={userId:e,mediaId:Number(n.sourceManga.mangaId),progress:Math.floor(n.chapterNum)};r||(a.status=N.CURRENT.id),n.chapterVolume&&(r?.progressVolumes??0)<Math.floor(n.chapterVolume)&&(a.progressVolumes=Math.floor(n.chapterVolume)-1),await h(J,!0,a),s.successfulItems.push(n.id)}catch{s.failedItems.push(n.id)}}return s}};var ye=`
query Query {
  GenreCollection
}
`,be=`
query Query {
  MediaTagCollection {
    isAdult
    name
  }
}
`;var K=class extends U{constructor(e){super();l(this,"genreOptions",[]);l(this,"tagOptions",[]);l(this,"optionsLoaded",!1);l(this,"loadError");l(this,"genres");l(this,"formats");l(this,"statuses");l(this,"countryOfOrigin");l(this,"sourceMaterials");l(this,"startYears");l(this,"chapterCounts");l(this,"volumeCounts");l(this,"adult");l(this,"doujin");l(this,"trackedTitles");l(this,"tags");this.loadOptions().then(({genres:o,tags:n})=>{this.genreOptions=o.GenreCollection.map(d=>({id:d.replaceAll(" ","_"),title:d})),this.tagOptions=n.MediaTagCollection.map(d=>({id:d.name.replaceAll(" ","_").replaceAll("'","?"),title:d.name})),this.optionsLoaded=!0}).catch(o=>{this.loadError=o}).finally(()=>{this.reloadForm()});let s=e.metadata??{};this.genres={...s.genres},this.formats={...s.formats},this.statuses={...s.publishingStatuses},this.countryOfOrigin=s.countryOfOrigin??[],this.sourceMaterials=s.sourceMaterials??[],this.startYears=s.startYears??"",this.chapterCounts=s.chapterCounts??"",this.volumeCounts=s.volumeCounts??"",this.adult=s.adult??"",this.doujin=s.doujin??"",this.trackedTitles=s.trackedTitles??"",this.tags={...s.tags}}async loadOptions(){if(Number(Application.getState("search-filters-query-date")??0)+604800>new Date().valueOf()/1e3){let n=JSON.parse(Application.getState("genres")),d=JSON.parse(Application.getState("tags"));return{genres:n,tags:d}}let s=await h(ye,!1),o=await h(be,!1);return Application.setState(JSON.stringify(s),"genres"),Application.setState(JSON.stringify(o),"tags"),Application.setState(String(new Date().valueOf()/1e3),"search-filters-query-date"),{genres:s,tags:o}}getSections(){return this.loadError?[p("error",[f("error",{title:"Error",subtitle:this.loadError.toString()})])]:this.optionsLoaded?[p({id:"filters"},[se("genres",{title:"Genres",layout:"flow",value:this.genres,items:this.genreOptions,allowExclusion:!0,allowEmptySelection:!0,onValueChange:Application.Selector(this,"handleGenresChange")})]),v(this,{id:"formats",header:"Formats",layout:"list",value:this.formats,items:Object.values(y).map(e=>({id:e.id,title:e.label})),allowExclusion:!0,allowEmptySelection:!0}),v(this,{id:"publishing-statuses",header:"Publishing Statuses",layout:"list",value:this.statuses,items:Object.values(m).map(e=>({id:e.id,title:e.label})),allowExclusion:!0,allowEmptySelection:!0}),F(this,{id:"country-of-origin",header:"Country of Origin",layout:"list",value:this.countryOfOrigin,items:Object.values(C).map(e=>({id:e.id,title:e.label})),minItemCount:0,maxItemCount:1}),p({id:"advanced-filters"},[G("source-materials",{title:"Source Materials",layout:"list",value:this.sourceMaterials,options:Object.values(ne).map(e=>({id:e.id,title:e.label})),minItemCount:0,maxItemCount:Object.values(ne).length,onValueChange:Application.Selector(this,"handleSourceMaterialsChange")})]),v(this,{id:"flags",header:"Flags",layout:"list",value:{...this.adult?{adult:this.adult}:{},...this.doujin?{doujin:this.doujin}:{},...this.trackedTitles?{trackedTitles:this.trackedTitles}:{}},items:[{id:"adult",title:"Adult"},{id:"doujin",title:"Doujin"},{id:"trackedTitles",title:"Tracked Titles"}],allowExclusion:!0,allowEmptySelection:!0}),p({id:"tags"},[se("tags",{title:"Tags",layout:"flow",value:this.tags,items:this.tagOptions,allowExclusion:!0,allowEmptySelection:!0,onValueChange:Application.Selector(this,"handleTagsChange")})]),p({id:"ranges",header:"Ranges",footer:'For each field, give a single value or two values separated by "-" for a range.'},[P("start-years",{title:"Start Years",value:this.startYears,onValueChange:Application.Selector(this,"handleStartYearsChange")}),P("chapter-counts",{title:"Chapter Counts",value:this.chapterCounts,onValueChange:Application.Selector(this,"handleChapterCountsChange")}),P("volume-counts",{title:"Volume Counts",value:this.volumeCounts,onValueChange:Application.Selector(this,"handleVolumeCountsChange")})])]:[p("loading",[f("loading",{title:"Loading..."})])]}async handleGenresChange(e){this.genres=e}async handleSourceMaterialsChange(e){this.sourceMaterials=e}async handleStartYearsChange(e){this.startYears=e}async handleChapterCountsChange(e){this.chapterCounts=e}async handleVolumeCountsChange(e){this.volumeCounts=e}async handleFlagsChange(e){this.adult=e.adult??"",this.doujin=e.doujin??"",this.trackedTitles=e.trackedTitles??""}async handleTagsChange(e){this.tags=e}getSearchQueryMetadata(){let e={};return Object.keys(this.genres).length>0&&(e.genres=this.genres),Object.keys(this.formats).length>0&&(e.formats=this.formats),Object.keys(this.statuses).length>0&&(e.publishingStatuses=this.statuses),this.countryOfOrigin.length===1&&(e.countryOfOrigin=this.countryOfOrigin),this.sourceMaterials.length>0&&(e.sourceMaterials=this.sourceMaterials),this.startYears&&(e.startYears=this.startYears),this.chapterCounts&&(e.chapterCounts=this.chapterCounts),this.volumeCounts&&(e.volumeCounts=this.volumeCounts),this.adult&&(e.adult=this.adult),this.doujin&&(e.doujin=this.doujin),this.trackedTitles&&(e.trackedTitles=this.trackedTitles),Object.keys(this.tags).length>0&&(e.tags=this.tags),e}};var Z=class extends w{async getAdvancedSearchForm(t){return new K(t)}async getSortingOptions(t){let e=[];for(let s of Object.keys(I)){let o=I[s];e.push({id:o.id,label:o.label})}return e}async getSearchResults(t,e,s){let o=!1,n={page:e??1,sort:s.id};t.title&&(n.search=t.title);let d=t.metadata??{};if(d.genres){let r=[],a=[];for(let[u,c]of Object.entries(d.genres))switch(c){case"included":r.push(u.replaceAll("_"," "));break;case"excluded":a.push(u.replaceAll("_"," "));break}r.length>0&&(n.genreIn=r),a.length>0&&(n.genreNotIn=a)}if(d.formats){let r=[],a=[];for(let[u,c]of Object.entries(d.formats))switch(c){case"included":r.push(u);break;case"excluded":a.push(u);break}r.length>0&&(n.formatIn=r),a.length>0&&(n.formatNotIn=a)}if(d.publishingStatuses){let r=[],a=[];for(let[u,c]of Object.entries(d.publishingStatuses))switch(c){case"included":r.push(u);break;case"excluded":a.push(u);break}r.length>0&&(n.statusIn=r),a.length>0&&(n.statusNotIn=a)}if(d.countryOfOrigin&&(n.countryOfOrigin=d.countryOfOrigin[0]),d.sourceMaterials&&d.sourceMaterials.length>0&&(n.sourceIn=d.sourceMaterials),d.startYears){let r=d.startYears.split("-").map(a=>Number(a));if(r.length>0&&r.length<=2&&!r.includes(NaN)&&r.every(a=>a>=0&&a<=9999))switch(r.length){case 1:n.startDateGreater=Number((r[0]-1).toString().padStart(4,"0"))*1e4,n.startDateLesser=Number((r[0]+1).toString().padStart(4,"0"))*1e4;break;case 2:r[0]<=r[1]&&(n.startDateGreater=Number(r[0].toString().padStart(4,"0"))*1e4,n.startDateLesser=Number(r[1].toString().padStart(4,"0"))*1e4);break}}if(d.chapterCounts){let r=d.chapterCounts.split("-").map(a=>Number(a));if(r.length>0&&r.length<=2&&!r.includes(NaN)&&r.every(a=>a>=0))switch(r.length){case 1:n.chaptersGreater=r[0]-1,n.chaptersLesser=r[0]+1;break;case 2:r[0]<=r[1]&&(n.chaptersGreater=r[0],n.chaptersLesser=r[1]);break}}if(d.volumeCounts){let r=d.volumeCounts.split("-").map(a=>Number(a));if(r.length>0&&r.length<=2&&!r.includes(NaN)&&r.every(a=>a>=0))switch(r.length){case 1:n.volumesGreater=r[0]-1,n.volumesLesser=r[0]+1;break;case 2:r[0]<=r[1]&&(n.volumesGreater=r[0],n.volumesLesser=r[1]);break}}switch(d.adult){case"included":n.isAdult=!0;break;case"excluded":n.isAdult=!1;break}switch(d.doujin){case"included":n.isLicensed=!1;break;case"excluded":n.isLicensed=!0;break}switch(d.trackedTitles){case"included":n.onList=!0,o=!0;break;case"excluded":n.onList=!1,o=!0;break}if(d.tags){let r=[],a=[];for(let[u,c]of Object.entries(d.tags))switch(c){case"included":r.push(u.replaceAll("_"," ").replaceAll("?","'"));break;case"excluded":a.push(u.replaceAll("_"," ").replaceAll("?","'"));break}r.length>0&&(n.tagIn=r),a.length>0&&(n.tagNotIn=a)}return B(q,n,o,e)}};var X=class{async getSettingsForm(){return new Q}};var D=class extends A{async interceptRequest(t){return t}async interceptResponse(t,e,s){return s}};var M=class{constructor(){l(this,"mainRateLimiter",new j("main",{numberOfRequests:1,bufferInterval:2,ignoreImages:!0}));l(this,"mainInterceptor",new D("main"))}async initialise(){this.mainRateLimiter.registerInterceptor(),this.mainInterceptor.registerInterceptor()}};he(M,[X,Z,Y,w,W]);var De=new M;return Oe(Me);})();
