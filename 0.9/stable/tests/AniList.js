var source = (function(exports) {

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

//#region \0@oxc-project+runtime@0.129.0/helpers/typeof.js
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}

//#endregion
//#region \0@oxc-project+runtime@0.129.0/helpers/toPrimitive.js
	function toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}

//#endregion
//#region \0@oxc-project+runtime@0.129.0/helpers/toPropertyKey.js
	function toPropertyKey(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}

//#endregion
//#region \0@oxc-project+runtime@0.129.0/helpers/defineProperty.js
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}

//#endregion
//#region node_modules/@paperback/types/lib/impl/SettingsUI/Form.js
	var Form = class {
		constructor() {
			_defineProperty(
				this,
				/**
				* When this is true, the app enables the `Submit` and `Cancel` buttons
				* that call {@link Form.formDidSubmit} and {@link Form.formDidCancel} respectively
				*
				* Notes: updating this after the form appears requires a call to {@link Form.reloadForm}
				*/
				"requiresExplicitSubmission",
				false
			);
		}
		reloadForm() {
			const formId = this["__underlying_formId"];
			if (!formId) return;
			Application.formDidChange(formId);
		}
	};

//#endregion
//#region node_modules/@paperback/types/lib/impl/Selector.js
	function closureSelector(base, closureId, closure) {
		base["__closure_selector-" + closureId] = closure;
		return Application.Selector(base, "__closure_selector-" + closureId);
	}

//#endregion
//#region node_modules/@paperback/types/lib/impl/SettingsUI/FormSection.js
	function Section(params, items) {
		let info;
		if (typeof params === "string") info = { id: params };
		else info = params;
		return {
			type: "listSection",
			...info,
			items: items.filter((x) => x),
			allowAddition: false,
			allowDeletion: false,
			allowReorder: false
		};
	}
	function FlowSection(params, items) {
		let info;
		if (typeof params === "string") info = { id: params };
		else info = params;
		return {
			type: "flowSection",
			...info,
			items: items.filter((x) => x)
		};
	}
	function SelectSection(form, params) {
		if (params.maxItemCount < 1) throw new Error(`[${params.id}] maxItemCount must not be less than one`);
		if (params.minItemCount < 0) throw new Error(`[${params.id}] minItemCount must not be less than zero`);
		if (params.minItemCount >= params.maxItemCount && params.maxItemCount > 1) throw new Error(`[${params.id}] minItemCount must be less than maxItemCount, or both must be one`);
		if (params.value.length < params.minItemCount) throw new Error(`[${params.id}] value count must not be less than minItemCount`);
		if (!params.value.every((item) => params.items.some((option) => option.id === item))) throw new Error(`[${params.id}] All provided values must be inside items`);
		const selectedOptionsLength = Object.keys(params.value).length;
		return (params.layout == "flow" ? FlowSection : Section)({
			id: params.id,
			header: params.header,
			footer: params.footer
		}, params.items.map((item) => {
			const selectedIndex = params.value.indexOf(item.id);
			const isSelected = selectedIndex !== -1;
			return LabelRow(item.id, {
				title: item.title,
				value: isSelected ? {
					symbol: "checkmark",
					style: "success"
				} : void 0,
				onSelect: closureSelector(form, `__select_${params.id}#${item.id}`, async () => {
					if (isSelected) {
						if (selectedOptionsLength > params.minItemCount) params.value.splice(selectedIndex, 1);
					} else if (params.maxItemCount == 1) params.value.splice(0, params.value.length, item.id);
					else if (selectedOptionsLength < params.maxItemCount) params.value.push(item.id);
					else return;
					if (params.onValueChange) await Application.SelectorRegistry.selector(params.onValueChange)();
					form.reloadForm();
				})
			});
		}));
	}
	function TriStateSelectSection(form, params) {
		const selectedOptionsLength = Object.keys(params.value).length;
		return (params.layout == "flow" ? FlowSection : Section)({
			id: params.id,
			header: params.header,
			footer: params.footer
		}, params.items.map((item) => {
			const currentState = params.value[item.id];
			let value;
			let style;
			switch (currentState) {
				case "included":
					if (params.layout == "flow") {
						style = "success";
						value = void 0;
					} else {
						style = void 0;
						value = {
							symbol: "checkmark",
							style: "success"
						};
					}
					break;
				case "excluded":
					if (params.layout == "flow") {
						style = "error";
						value = void 0;
					} else {
						style = void 0;
						value = {
							symbol: "xmark",
							style: "error"
						};
					}
					break;
				default:
					value = void 0;
					style = void 0;
					break;
			}
			return LabelRow(item.id, {
				style,
				title: item.title,
				value,
				onSelect: closureSelector(form, `__multiselect_${params.id}#${item.id}`, async () => {
					let nextState;
					const canSelect = !params.maximum || selectedOptionsLength < params.maximum;
					const canDeselect = params.allowEmptySelection && selectedOptionsLength == 1 || selectedOptionsLength > 1;
					switch (currentState) {
						case "included":
							if (params.allowExclusion) {
								nextState = "excluded";
								break;
							}
							if (canDeselect) {
								nextState = void 0;
								break;
							} else return;
						case "excluded": if (canDeselect) {
							nextState = void 0;
							break;
						} else return;
						case void 0: if (canSelect) {
							nextState = "included";
							break;
						} else return;
					}
					if (nextState == void 0) delete params.value[item.id];
					else params.value[item.id] = nextState;
					if (params.onValueChange) await Application.SelectorRegistry.selector(params.onValueChange)();
					form.reloadForm();
				})
			});
		}));
	}

//#endregion
//#region node_modules/@paperback/types/lib/impl/SettingsUI/FormItemElement.js
	function LabelRow(id, props) {
		return {
			...props,
			id,
			type: "labelRow",
			isHidden: props.isHidden ?? false,
			isSelectable: props.onSelect != void 0
		};
	}
	function InputRow(id, props) {
		return {
			...props,
			id,
			type: "inputRow",
			isHidden: props.isHidden ?? false
		};
	}
	function StepperRow(id, props) {
		return {
			...props,
			id,
			type: "stepperRow",
			isHidden: props.isHidden ?? false
		};
	}
	function ToggleRow(id, props) {
		return {
			...props,
			id,
			type: "toggleRow",
			isHidden: props.isHidden ?? false
		};
	}
	function SelectRow(id, props) {
		const selectedItemsCount = Object.keys(props.value).length;
		return NavigationRow(id, {
			form: new SelectForm(props.title, props),
			title: props.title,
			subtitle: props.subtitle,
			value: selectedItemsCount == 1 ? `${("items" in props ? props.items.find((x) => x.id == props.value[0])?.title : props.options.find((x) => x.id == props.value[0])?.title) ?? "1 item"}` : `${Object.keys(props.value).length} items`,
			isHidden: props.isHidden
		});
	}
	function TriStateSelectRow(id, props) {
		return NavigationRow(id, {
			form: new TriStateSelectForm(props.title, props),
			title: props.title,
			subtitle: props.subtitle,
			value: `${Object.keys(props.value).length} items`,
			isHidden: props.isHidden
		});
	}
	function ButtonRow(id, props) {
		return {
			...props,
			id,
			type: "buttonRow",
			isHidden: props.isHidden ?? false
		};
	}
	function NavigationRow(id, props) {
		return {
			...props,
			id,
			type: "navigationRow",
			isHidden: props.isHidden ?? false
		};
	}
	function OAuthButtonRow(id, props) {
		return {
			...props,
			id,
			type: "oauthButtonRow",
			isHidden: props.isHidden ?? false
		};
	}
	var SelectForm = class extends Form {
		constructor(title, params) {
			super();
			_defineProperty(this, "title", void 0);
			_defineProperty(this, "params", void 0);
			_defineProperty(this, "states", []);
			_defineProperty(this, "requiresExplicitSubmission", true);
			this.title = title;
			this.params = params;
			this.states = [...params.value];
		}
		getSections() {
			return [SelectSection(this, {
				id: "select",
				value: this.states,
				layout: "layout" in this.params ? this.params.layout : "list",
				items: "items" in this.params ? this.params.items : this.params.options,
				minItemCount: this.params.minItemCount,
				maxItemCount: this.params.maxItemCount,
				isHidden: this.params.isHidden
			})];
		}
		async formDidSubmit() {
			await Application.SelectorRegistry.selector(this.params.onValueChange)(this.states);
		}
	};
	var TriStateSelectForm = class extends Form {
		constructor(title, params) {
			super();
			_defineProperty(this, "title", void 0);
			_defineProperty(this, "params", void 0);
			_defineProperty(this, "states", {});
			_defineProperty(this, "requiresExplicitSubmission", true);
			this.title = title;
			this.params = params;
			this.states = { ...params.value };
		}
		getSections() {
			return [TriStateSelectSection(this, {
				id: "multiselect",
				value: this.states,
				items: this.params.items,
				allowExclusion: this.params.allowExclusion,
				allowEmptySelection: this.params.allowEmptySelection,
				maximum: this.params.maximum,
				layout: this.params.layout
			})];
		}
		async formDidSubmit() {
			await Application.SelectorRegistry.selector(this.params.onValueChange)(this.states);
		}
	};

//#endregion
//#region node_modules/@paperback/types/lib/impl/interfaces/ChapterProviding.js
	function implementsChapterProviding(extension) {
		return hasPropertiesOf(["getChapters", "getMangaDetails"], extension);
	}

//#endregion
//#region node_modules/@paperback/types/lib/impl/interfaces/SearchResultsProviding.js
	function implementsSearchResultsProviding(extension) {
		return hasPropertiesOf(["getSearchResults"], extension);
	}
	var AdvancedSearchForm = class extends Form {
		constructor(..._args) {
			super(..._args);
			_defineProperty(
				this,
				/**
				* This is always true
				*/
				"requiresExplicitSubmission",
				true
			);
		}
		async formDidSubmit() {}
		formDidCancel() {}
	};

//#endregion
//#region node_modules/@paperback/types/lib/impl/interfaces/index.js
	function hasPropertiesOf(properties, obj) {
		return properties.every((k) => k in obj);
	}

//#endregion
//#region node_modules/@paperback/types/lib/impl/PaperbackInterceptor.js
	var PaperbackInterceptor = class {
		constructor(id) {
			_defineProperty(this, "id", void 0);
			this.id = id;
		}
		registerInterceptor() {
			Application.registerInterceptor(this.id, Application.Selector(this, "interceptRequest"), Application.Selector(this, "interceptResponse"));
		}
		unregisterInterceptor() {
			Application.unregisterInterceptor(this.id);
		}
	};

//#endregion
//#region node_modules/@paperback/types/lib/impl/Lock.js
	const promises = {}, resolvers = {};
	const lock = async (uid) => {
		if (promises[uid]) {
			await promises[uid];
			await lock(uid);
			return;
		}
		promises[uid] = new Promise((resolve) => resolvers[uid] = () => {
			delete promises[uid];
			resolve();
		});
	};
	const unlock = (uid) => {
		if (resolvers[uid]) resolvers[uid]();
	};

//#endregion
//#region node_modules/@paperback/types/lib/impl/BasicRateLimiter.js
	var BasicRateLimiter = class extends PaperbackInterceptor {
		constructor(id, options) {
			super(id);
			_defineProperty(this, "options", void 0);
			_defineProperty(this, "promise", void 0);
			_defineProperty(this, "currentRequestsMade", 0);
			_defineProperty(this, "lastReset", Date.now());
			_defineProperty(this, "imageRegex", /* @__PURE__ */ new RegExp(/\.(avif|gif|jpeg|jpg|jxl|png|webp)(\?|$)/i));
			this.options = options;
		}
		async interceptRequest(request) {
			if (this.options.ignoreImages && this.imageRegex.test(request.url)) return request;
			await lock(this.id);
			await this.incrementRequestCount();
			unlock(this.id);
			return request;
		}
		async interceptResponse(request, response, data) {
			return data;
		}
		async incrementRequestCount() {
			await this.promise;
			if ((Date.now() - this.lastReset) / 1e3 > this.options.bufferInterval) {
				this.currentRequestsMade = 0;
				this.lastReset = Date.now();
			}
			this.currentRequestsMade += 1;
			if (this.currentRequestsMade >= this.options.numberOfRequests) {
				const secondsSinceLastReset = (Date.now() - this.lastReset) / 1e3;
				if (secondsSinceLastReset <= this.options.bufferInterval) {
					const sleepTime = this.options.bufferInterval - secondsSinceLastReset;
					console.log(`[BasicRateLimiter] rate limit hit, sleeping for ${sleepTime}`);
					this.promise = Application.sleep(sleepTime);
				}
			}
		}
	};

//#endregion
//#region node_modules/@paperback/types/lib/impl/SourceInfo.js
	var SourceIntents;
	(function(SourceIntents) {
		SourceIntents[SourceIntents["NONE"] = 0] = "NONE";
		/**
		* @deprecated use {@link CHAPTER_PROVIDING}
		*/
		SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
		SourceIntents[SourceIntents["CHAPTER_PROVIDING"] = 1] = "CHAPTER_PROVIDING";
		/**
		* @deprecated use {@link PROGRESS_PROVIDING}
		*/
		SourceIntents[SourceIntents["MANGA_PROGRESS"] = 2] = "MANGA_PROGRESS";
		/**
		* @deprecated use {@link PROGRESS_PROVIDING}
		*/
		SourceIntents[SourceIntents["MANGA_PROGRESS_PROVIDING"] = 2] = "MANGA_PROGRESS_PROVIDING";
		SourceIntents[SourceIntents["PROGRESS_PROVIDING"] = 2] = "PROGRESS_PROVIDING";
		/**
		* @deprecated use {@link DISCOVER_SECTION_PROVIDING}
		*/
		SourceIntents[SourceIntents["DISCOVER_SECIONS"] = 4] = "DISCOVER_SECIONS";
		/**
		* @deprecated use {@link DISCOVER_SECTION_PROVIDING}
		*/
		SourceIntents[SourceIntents["DISCOVER_SECIONS_PROVIDING"] = 4] = "DISCOVER_SECIONS_PROVIDING";
		SourceIntents[SourceIntents["DISCOVER_SECTION_PROVIDING"] = 4] = "DISCOVER_SECTION_PROVIDING";
		/**
		* @deprecated use {@link MANAGED_COLLECTION_PROVIDING}
		*/
		SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
		SourceIntents[SourceIntents["MANAGED_COLLECTION_PROVIDING"] = 8] = "MANAGED_COLLECTION_PROVIDING";
		/**
		* @deprecated use {@link CLOUDFLARE_BYPASS_PROVIDING}
		*/
		SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
		SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_PROVIDING"] = 16] = "CLOUDFLARE_BYPASS_PROVIDING";
		/**
		* @deprecated use {@link SETTINGS_FORM_PROVIDING}
		*/
		SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
		SourceIntents[SourceIntents["SETTINGS_FORM_PROVIDING"] = 32] = "SETTINGS_FORM_PROVIDING";
		/**
		* @deprecated use {@link SEARCH_RESULT_PROVIDING}
		*/
		SourceIntents[SourceIntents["MANGA_SEARCH"] = 64] = "MANGA_SEARCH";
		/**
		* @deprecated use {@link SEARCH_RESULT_PROVIDING}
		*/
		SourceIntents[SourceIntents["SEARCH_RESULTS_PROVIDING"] = 64] = "SEARCH_RESULTS_PROVIDING";
		SourceIntents[SourceIntents["SEARCH_RESULT_PROVIDING"] = 64] = "SEARCH_RESULT_PROVIDING";
	})(SourceIntents || (SourceIntents = {}));
	/**
	* A content rating to be attributed to each source.
	*/
	var ContentRating;
	(function(ContentRating) {
		ContentRating["EVERYONE"] = "SAFE";
		ContentRating["MATURE"] = "MATURE";
		ContentRating["ADULT"] = "ADULT";
	})(ContentRating || (ContentRating = {}));

//#endregion
//#region node_modules/@paperback/types/lib/DiscoverSectionType.js
	var DiscoverSectionType;
	(function(DiscoverSectionType) {
		DiscoverSectionType[DiscoverSectionType["featured"] = 0] = "featured";
		DiscoverSectionType[DiscoverSectionType["simpleCarousel"] = 1] = "simpleCarousel";
		DiscoverSectionType[DiscoverSectionType["prominentCarousel"] = 2] = "prominentCarousel";
		DiscoverSectionType[DiscoverSectionType["chapterUpdates"] = 3] = "chapterUpdates";
		DiscoverSectionType[DiscoverSectionType["genres"] = 4] = "genres";
	})(DiscoverSectionType || (DiscoverSectionType = {}));

//#endregion
//#region node_modules/@paperback/types/lib/PagedResults.js
	const EndOfPageResults = Object.freeze({
		items: [],
		metadata: void 0
	});

//#endregion
//#region src/AniList/GraphQL/DiscoverSectionsAndSearch.ts
	const discoverSectionsAndSearchQuery = `
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
      synonyms
      title {
        english
        native
        romaji
      }
      volumes
    }
  }
}
`;

//#endregion
//#region src/AniList/GraphQL/General.ts
	const CountryCode = {
		JP: {
			id: "JP",
			label: "Japan"
		},
		KR: {
			id: "KR",
			label: "South Korea"
		},
		CN: {
			id: "CN",
			label: "China"
		},
		TW: {
			id: "TW",
			label: "Taiwan"
		}
	};
	const MediaFormat = {
		MANGA: {
			id: "MANGA",
			label: "Manga"
		},
		NOVEL: {
			id: "NOVEL",
			label: "Novel"
		},
		ONE_SHOT: {
			id: "ONE_SHOT",
			label: "One Shot"
		}
	};
	const MediaStatus = {
		FINISHED: {
			id: "FINISHED",
			label: "Finished"
		},
		RELEASING: {
			id: "RELEASING",
			label: "Releasing"
		},
		NOT_YET_RELEASED: {
			id: "NOT_YET_RELEASED",
			label: "Not Yet Released"
		},
		CANCELLED: {
			id: "CANCELLED",
			label: "Cancelled"
		},
		HIATUS: {
			id: "HIATUS",
			label: "Hiatus"
		}
	};
	const MediaSort = {
		SEARCH_MATCH: {
			id: "SEARCH_MATCH",
			label: "Search Match"
		},
		ID: {
			id: "ID",
			label: "Id ↑"
		},
		ID_DESC: {
			id: "ID_DESC",
			label: "Id ↓"
		},
		TITLE_ROMAJI: {
			id: "TITLE_ROMAJI",
			label: "Title Romaji ↑"
		},
		TITLE_ROMAJI_DESC: {
			id: "TITLE_ROMAJI_DESC",
			label: "Title Romaji ↓"
		},
		TITLE_ENGLISH: {
			id: "TITLE_ENGLISH",
			label: "Title English ↑"
		},
		TITLE_ENGLISH_DESC: {
			id: "TITLE_ENGLISH_DESC",
			label: "Title English ↓"
		},
		TITLE_NATIVE: {
			id: "TITLE_NATIVE",
			label: "Title Native ↑"
		},
		TITLE_NATIVE_DESC: {
			id: "TITLE_NATIVE_DESC",
			label: "Title Native ↓"
		},
		FORMAT: {
			id: "FORMAT",
			label: "Format ↑"
		},
		FORMAT_DESC: {
			id: "FORMAT_DESC",
			label: "Format ↓"
		},
		START_DATE: {
			id: "START_DATE",
			label: "Start Date ↑"
		},
		START_DATE_DESC: {
			id: "START_DATE_DESC",
			label: "Start Date ↓"
		},
		END_DATE: {
			id: "END_DATE",
			label: "End Date ↑"
		},
		END_DATE_DESC: {
			id: "END_DATE_DESC",
			label: "End Date ↓"
		},
		SCORE: {
			id: "SCORE",
			label: "Score ↑"
		},
		SCORE_DESC: {
			id: "SCORE_DESC",
			label: "Score ↓"
		},
		POPULARITY: {
			id: "POPULARITY",
			label: "Popularity ↑"
		},
		POPULARITY_DESC: {
			id: "POPULARITY_DESC",
			label: "Popularity ↓"
		},
		TRENDING: {
			id: "TRENDING",
			label: "Trending ↑"
		},
		TRENDING_DESC: {
			id: "TRENDING_DESC",
			label: "Trending ↓"
		},
		STATUS: {
			id: "STATUS",
			label: "Status ↑"
		},
		STATUS_DESC: {
			id: "STATUS_DESC",
			label: "Status ↓"
		},
		CHAPTERS: {
			id: "CHAPTERS",
			label: "Chapters ↑"
		},
		CHAPTERS_DESC: {
			id: "CHAPTERS_DESC",
			label: "Chapters ↓"
		},
		VOLUMES: {
			id: "VOLUMES",
			label: "Volumes ↑"
		},
		VOLUMES_DESC: {
			id: "VOLUMES_DESC",
			label: "Volumes ↓"
		},
		UPDATED_AT: {
			id: "UPDATED_AT",
			label: "Updated At ↑"
		},
		UPDATED_AT_DESC: {
			id: "UPDATED_AT_DESC",
			label: "Updated At ↓"
		},
		FAVOURITES: {
			id: "FAVOURITES",
			label: "Favourites ↑"
		},
		FAVOURITES_DESC: {
			id: "FAVOURITES_DESC",
			label: "Favourites ↓"
		}
	};
	const MediaSourceMaterial = {
		ORIGINAL: {
			id: "ORIGINAL",
			label: "Original"
		},
		MANGA: {
			id: "MANGA",
			label: "Manga"
		},
		LIGHT_NOVEL: {
			id: "LIGHT_NOVEL",
			label: "Light Novel"
		},
		WEB_NOVEL: {
			id: "WEB_NOVEL",
			label: "Web Novel"
		},
		NOVEL: {
			id: "NOVEL",
			label: "Novel"
		},
		Anime: {
			id: "ANIME",
			label: "Anime"
		},
		VISUAL_NOVEL: {
			id: "VISUAL_NOVEL",
			label: "Visual Novel"
		},
		VIDEO_GAME: {
			id: "VIDEO_GAME",
			label: "Video Game"
		},
		DOUJINSHI: {
			id: "DOUJINSHI",
			label: "Doujinshi"
		},
		COMIC: {
			id: "COMIC",
			label: "Comic"
		},
		LIVE_ACTION: {
			id: "LIVE_ACTION",
			label: "Live Action"
		},
		GAME: {
			id: "GAME",
			label: "Game"
		},
		MULTIMEDIA_PROJECT: {
			id: "MULTIMEDIA_PROJECT",
			label: "Multimedia Project"
		},
		PICTURE_BOOK: {
			id: "PICTURE_BOOK",
			label: "Picture Book"
		},
		OTHER: {
			id: "OTHER",
			label: "Other"
		}
	};

//#endregion
//#region src/AniList/GraphQL/Viewer.ts
	const viewerQuery = `
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
`;

//#endregion
//#region src/AniList/Services/Requests.ts
	const GRAPHQL_ENDPOINT = "https://graphql.anilist.co";
	async function makeRequest(query, needsAuth, QueryVariables) {
		const request = {
			url: GRAPHQL_ENDPOINT,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({
				query,
				variables: QueryVariables
			})
		};
		if (needsAuth) {
			const token = String(Application.getSecureState("session"));
			if (token == void 0) throw new Error("You are not authenticated, please log in through the AniList settings");
			const payload = JSON.parse(Application.base64Decode(token.split(".")[1]));
			if (Number(payload.exp) < (/* @__PURE__ */ new Date()).valueOf() / 1e3) {
				Application.setSecureState(null, "session");
				Application.setState(null, "viewer-id");
				throw new Error("Your authorization token has expired, please log back in through the AniList settings");
			}
			request.headers.Authorization = "Bearer " + token;
		}
		const [_, buffer] = await Application.scheduleRequest(request);
		const data = Application.arrayBufferToUTF8String(buffer);
		const unkownResponse = JSON.parse(data);
		if (unkownResponse == void 0 || typeof unkownResponse !== "object" || !("data" in unkownResponse || "error" in unkownResponse)) throw new Error(`Failed to parse JSON object: ${String(unkownResponse)}`);
		const response = unkownResponse;
		if (response.errors != void 0) {
			let errorMessages = "";
			for (let i = 0; i < response.errors.length; i++) {
				if (i != 0) errorMessages += "\n";
				errorMessages += `AniList returned an error: [${response.errors[i].status}] ${response.errors[i].message}`;
			}
			throw new Error(errorMessages);
		}
		return response.data;
	}

//#endregion
//#region src/AniList/Implementations/SettingsForm/form.ts
	function getSynonymsSetting() {
		return Application.getState("setting-synonyms-in-titles");
	}
	var SettingsForm = class extends Form {
		getSections() {
			if (Application.getSecureState("session") == void 0) return [Section("no-session", [this.loginButton()])];
			return [Section("session", [this.profileViewNavigation(), this.logOutButton()]), Section("settings", [this.synonymsToggle()])];
		}
		loginButton() {
			return OAuthButtonRow("login", {
				title: "Log In",
				subtitle: "Log in to AniList to automatically sync your library and reading progress.",
				onSuccess: Application.Selector(this, "handleLoginSuccess"),
				authorizeEndpoint: "https://anilist.co/api/v2/oauth/authorize?client_id=6621&response_type=token",
				responseType: { type: "token" },
				clientId: "6621"
			});
		}
		profileViewNavigation() {
			return NavigationRow("profile-view", {
				title: "View Profile",
				form: new ProfileViewForm()
			});
		}
		logOutButton() {
			return ButtonRow("log-out", {
				title: "Log Out",
				onSelect: Application.Selector(this, "logOut")
			});
		}
		synonymsToggle() {
			return ToggleRow("synonyms", {
				title: "Display title synonyms if the title is not in English",
				value: getSynonymsSetting() ?? false,
				onValueChange: Application.Selector(this, "handleSynonymsToggle")
			});
		}
		async handleSynonymsToggle(value) {
			Application.setState(value, "setting-synonyms-in-titles");
			Application.invalidateDiscoverSections();
			this.reloadForm();
		}
		async handleLoginSuccess(accessToken) {
			Application.setSecureState(accessToken, "session");
			const viewer = await makeRequest(viewerQuery, true);
			Application.setState(viewer.Viewer.id, "viewer-id");
			this.reloadForm();
		}
		async logOut() {
			Application.setSecureState(null, "session");
			Application.setState(null, "viewer-id");
			this.reloadForm();
		}
	};
	var ProfileViewForm = class extends Form {
		constructor(..._args) {
			super(..._args);
			_defineProperty(this, "loadRequest", void 0);
			_defineProperty(this, "viewer", void 0);
			_defineProperty(this, "error", void 0);
		}
		formWillAppear() {
			this.loadRequest = makeRequest(viewerQuery, true).then((viewer) => {
				this.viewer = viewer;
			}).catch((error) => {
				this.error = error;
			}).finally(() => {
				this.reloadForm();
			});
		}
		getSections() {
			if (this.viewer == void 0 && this.error == void 0) return [Section("loading", [LabelRow("loading", { title: "Loading..." })])];
			if (this.error != void 0) return [Section("error", [LabelRow("error", {
				title: "Error",
				subtitle: this.error.toString()
			})])];
			return [...this.getProfileSection(this.viewer), this.getSessionSection()];
		}
		getProfileSection(value) {
			return [Section({
				id: "profile-data",
				header: "Profile"
			}, [LabelRow("username-id", {
				title: "Username",
				value: value.Viewer.name,
				subtitle: "Id: " + value.Viewer.id.toString()
			}), LabelRow("creation-date", {
				title: "Creation Date",
				value: (/* @__PURE__ */ new Date(value.Viewer.createdAt * 1e3)).toLocaleString()
			})]), Section({
				id: "manga-list-settings",
				header: "Manga List Settings",
				footer: "At a later time these will become editable, please use the website (aniList.co) for now."
			}, [
				LabelRow("advanced-scoring-enabled", {
					title: "Advanced Scoring Enabled",
					value: value.Viewer.mediaListOptions.mangaList.advancedScoringEnabled ? "True" : "False"
				}),
				SelectRow("advanced-scoring-fields", {
					title: "Advanced Scoring Fields",
					layout: "list",
					items: value.Viewer.mediaListOptions.mangaList.advancedScoring.map((v) => {
						return {
							id: v.toLowerCase().replaceAll(" ", "-"),
							title: v
						};
					}),
					value: [],
					minItemCount: 0,
					maxItemCount: 1,
					onValueChange: Application.Selector(this, "noOp")
				}),
				SelectRow("custom-lists", {
					title: "Custom Lists",
					layout: "list",
					items: value.Viewer.mediaListOptions.mangaList.customLists.map((v) => {
						return {
							id: v.toLowerCase().replaceAll(" ", "-"),
							title: v
						};
					}),
					value: [],
					minItemCount: 0,
					maxItemCount: 1,
					onValueChange: Application.Selector(this, "noOp")
				}),
				LabelRow("split-completed-list-by-format", {
					title: "Split Completed List by Format",
					value: value.Viewer.mediaListOptions.mangaList.splitCompletedSectionByFormat ? "True" : "False"
				}),
				SelectRow("list-order", {
					title: "List Order",
					layout: "list",
					items: value.Viewer.mediaListOptions.mangaList.sectionOrder.map((v) => {
						return {
							id: v.toLowerCase().replaceAll(" ", "-"),
							title: v
						};
					}),
					value: [],
					minItemCount: 0,
					maxItemCount: 1,
					onValueChange: Application.Selector(this, "noOp")
				})
			])];
		}
		async noOp(_value) {}
		getSessionSection() {
			const token = String(Application.getSecureState("session"));
			const payload = JSON.parse(Application.base64Decode(token.split(".")[1]));
			const rows = [];
			for (const [key, value] of Object.entries(payload)) {
				const labelProps = { title: key };
				if (key == "jti") labelProps.subtitle = String(value);
				else labelProps.value = String(value) || "Undefined";
				rows.push(LabelRow(key, labelProps));
			}
			return Section({
				id: "session-data",
				header: "Session"
			}, rows);
		}
	};

//#endregion
//#region src/AniList/Implementations/helper.ts
	async function getItems(query, queryVariables, needsAuth, metadata) {
		const items = [];
		const json = await makeRequest(query, needsAuth, queryVariables);
		const searchResults = json.Page.media;
		for (const searchResult of searchResults) {
			let title = "";
			switch (searchResult.format) {
				case "NOVEL":
					title += "(" + MediaFormat.NOVEL.label + ") ";
					break;
				case "ONE_SHOT": title += "(" + MediaFormat.ONE_SHOT.label + ") ";
			}
			title += searchResult.title.english ?? searchResult.title.romaji ?? searchResult.title.native ?? "No Title";
			if (getSynonymsSetting() == true && searchResult.synonyms.length > 0 && !searchResult.title.english) title += " / " + searchResult.synonyms[0];
			const contentRating = searchResult.isAdult ? ContentRating.ADULT : searchResult.genres.some((e) => e == "ecchi") ? ContentRating.MATURE : ContentRating.EVERYONE;
			let subtitle;
			switch (searchResult.status) {
				case MediaStatus.FINISHED.id:
					if (!searchResult.chapters && !searchResult.volumes) {
						subtitle = MediaStatus.FINISHED.label;
						break;
					}
					subtitle = [searchResult.chapters ? "Chs. " + searchResult.chapters.toString() : "", searchResult.volumes ? "Vols. " + searchResult.volumes.toString() : ""].join(" ");
					break;
				case MediaStatus.NOT_YET_RELEASED.id:
					subtitle = MediaStatus.NOT_YET_RELEASED.label;
					break;
				case MediaStatus.CANCELLED.id:
					subtitle = MediaStatus.CANCELLED.label;
					break;
				case MediaStatus.HIATUS.id:
					subtitle = MediaStatus.HIATUS.label;
					break;
				case MediaStatus.RELEASING.id: subtitle = MediaStatus.RELEASING.label;
			}
			items.push({
				mangaId: searchResult.id.toString(),
				title,
				imageUrl: searchResult.coverImage.large,
				contentRating,
				subtitle
			});
		}
		metadata = json.Page.pageInfo.hasNextPage ? (metadata ?? 1) + 1 : void 0;
		return {
			items,
			metadata
		};
	}
	function applyMixins(derivedCtor, constructors) {
		constructors.forEach((baseCtor) => {
			Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
				Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
			});
		});
	}

//#endregion
//#region src/AniList/Implementations/DiscoverSection/main.ts
	var DiscoverSectionImplementation = class {
		async getDiscoverSections() {
			return [
				{
					id: "trending-now",
					title: "Trending Now",
					type: DiscoverSectionType.featured
				},
				{
					id: "all-time-popular",
					title: "All Time Popular",
					type: DiscoverSectionType.prominentCarousel
				},
				{
					id: "popular-manga",
					title: "Popular Manga",
					type: DiscoverSectionType.simpleCarousel
				},
				{
					id: "popular-manhwa",
					title: "Popular Manhwa",
					type: DiscoverSectionType.simpleCarousel
				},
				{
					id: "top-100-manga",
					title: "Top 100 Manga",
					type: DiscoverSectionType.prominentCarousel
				}
			];
		}
		async getDiscoverSectionItems(section, metadata) {
			let sort;
			let countryOfOrigin;
			switch (section.id) {
				case "trending-now":
					sort = MediaSort.TRENDING_DESC.id;
					break;
				case "all-time-popular":
					sort = MediaSort.POPULARITY_DESC.id;
					break;
				case "popular-manga":
					sort = MediaSort.POPULARITY_DESC.id;
					countryOfOrigin = CountryCode.JP.id;
					break;
				case "popular-manhwa":
					sort = MediaSort.POPULARITY_DESC.id;
					countryOfOrigin = CountryCode.KR.id;
					break;
				case "top-100-manga":
					sort = MediaSort.SCORE_DESC.id;
					break;
			}
			return getItems(discoverSectionsAndSearchQuery, {
				page: metadata ?? 1,
				sort,
				countryOfOrigin
			}, false, metadata);
		}
	};

//#endregion
//#region src/AniList/GraphQL/ManagedCollection.ts
	const managedStatusCollectionQuery = `
query MediaListCollection(
  $userId: Int
  $chunk: Int
  $status: MediaListStatus
) {
  MediaListCollection(
    userId: $userId
    type: MANGA
    chunk: $chunk
    perChunk: 500
    status: $status
  ) {
    lists {
      name
      isCustomList
      entries {
        media {
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
          id
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
    }
    hasNextChunk
  }
}
`;
	const managedCustomCollectionQuery = `
query MediaListCollection(
  $userId: Int
  $chunk: Int
) {
  MediaListCollection(
    userId: $userId
    type: MANGA
    chunk: $chunk
    perChunk: 500
  ) {
    lists {
      name
      isCustomList
      entries {
        media {
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
          id
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
    }
    hasNextChunk
  }
}
`;

//#endregion
//#region src/AniList/Implementations/shared/parsers.ts
	function parseTitleDetails(input) {
		const mangaId = input.id.toString();
		let synopsis = input.description ? input.description.replaceAll(/<br>|<i>|<\/i>|<a.*?>|<\/a>/g, "") : "No description";
		synopsis += input.synonyms.length > 0 ? "\n\nSynonyms: " + input.synonyms.join(", ") + "\n\n" : "";
		const secondaryTitles = [];
		for (const title of Object.values(input.title)) {
			if (title == void 0) continue;
			secondaryTitles.push(title);
		}
		for (const synonym of input.synonyms) secondaryTitles.push(synonym);
		let primaryTitle = input.title.english ?? input.title.romaji ?? input.title.native ?? "No Title";
		if (getSynonymsSetting() == true && input.synonyms.length > 0 && !input.title.english) primaryTitle += "\n" + input.synonyms[0];
		let status;
		switch (input.status) {
			case MediaStatus.FINISHED.id:
				status = MediaStatus.FINISHED.label;
				break;
			case MediaStatus.NOT_YET_RELEASED.id:
				status = MediaStatus.NOT_YET_RELEASED.label;
				break;
			case MediaStatus.CANCELLED.id:
				status = MediaStatus.CANCELLED.label;
				break;
			case MediaStatus.HIATUS.id:
				status = MediaStatus.HIATUS.label;
				break;
			case MediaStatus.RELEASING.id: status = MediaStatus.RELEASING.label;
		}
		let author, artist;
		for (const staff of input.staff.edges) {
			if (staff.role.startsWith("Story & Art")) {
				author = staff.node.name.full;
				artist = void 0;
				break;
			}
			if (!author && (staff.role.startsWith("Story") || staff.role.startsWith("Original Story"))) {
				author = staff.node.name.full;
				if (author && artist) break;
			}
			if (staff.role.startsWith("Art")) {
				artist = staff.node.name.full;
				if (author && artist) break;
			}
		}
		const rating = input.averageScore ? input.averageScore / 100 : void 0;
		const genres = [];
		for (const genre of input.genres) genres.push({
			id: genre.replaceAll(" ", "_").toLowerCase(),
			title: genre
		});
		const tags = [];
		for (const tag of input.tags) tags.push({
			id: tag.id.toString().replaceAll(" ", "_").toLowerCase(),
			title: tag.name
		});
		const tagGroups = [{
			id: "genres",
			title: "Genres",
			tags: genres
		}, {
			id: "tags",
			title: "Tags",
			tags
		}];
		const contentRating = input.isAdult ? ContentRating.ADULT : genres.some((e) => e.id == "ecchi") ? ContentRating.MATURE : ContentRating.EVERYONE;
		const artworkUrls = [input.coverImage.extraLarge];
		if (input.bannerImage != null) artworkUrls.push(input.bannerImage);
		const additionalInfo = { Format: input.format == MediaFormat.MANGA.id ? MediaFormat.MANGA.label : input.format == MediaFormat.NOVEL.id ? MediaFormat.NOVEL.label : MediaFormat.ONE_SHOT.label };
		return {
			mangaId,
			mangaInfo: {
				thumbnailUrl: input.coverImage.extraLarge,
				synopsis,
				primaryTitle,
				secondaryTitles,
				contentRating,
				status,
				artist,
				author,
				bannerUrl: input.bannerImage ?? void 0,
				rating,
				tagGroups,
				artworkUrls,
				shareUrl: "https://anilist.co/manga/" + mangaId,
				additionalInfo
			}
		};
	}

//#endregion
//#region src/AniList/Implementations/ManagedCollection/main.ts
	var ManagedCollectionImplementation = class {
		async getManagedLibraryCollections() {
			const viewer = await makeRequest(viewerQuery, true);
			let statuses = {
				Reading: {
					status: "CURRENT",
					matched: false
				},
				Planning: {
					status: "PLANNING",
					matched: false
				},
				Completed: {
					status: "COMPLETED",
					matched: false
				},
				"Completed Manga": {
					status: "COMPLETED",
					matched: false
				},
				"Completed One Shot": {
					status: "COMPLETED",
					matched: false
				},
				"Completed Novel": {
					status: "COMPLETED",
					matched: false
				},
				Dropped: {
					status: "DROPPED",
					matched: false
				},
				Paused: {
					status: "PAUSED",
					matched: false
				},
				Rereading: {
					status: "REPEATING",
					matched: false
				}
			};
			return viewer.Viewer.mediaListOptions.mangaList.sectionOrder.map((list) => {
				let isCustomList;
				let statusType;
				const statusList = statuses[list];
				if (statusList && statusList.matched == false) {
					isCustomList = "false";
					statusType = statuses[list].status;
					statuses[list].matched = true;
				} else {
					isCustomList = "true";
					statusType = "null";
				}
				return {
					id: `${viewer.Viewer.id.toString()}-${isCustomList}-${statusType}-${list.toLowerCase().replaceAll(" ", "-")}`,
					title: list
				};
			});
		}
		async commitManagedCollectionChanges(_changeset) {
			throw new Error("Pushing changes to AniList via collection management is not supported at this moment, use progress tracking instead.");
		}
		async getSourceMangaInManagedCollection(managedCollection) {
			const results = [];
			const [userId, isCustomListString, status] = managedCollection.id.split("-", 4);
			const isCustomList = isCustomListString === "true";
			const query = isCustomList ? managedCustomCollectionQuery : managedStatusCollectionQuery;
			const variables = isCustomList ? {
				userId: +userId,
				chunk: 1
			} : {
				userId: +userId,
				chunk: 1,
				status
			};
			while (true) {
				const { lists, hasNextChunk } = (await makeRequest(query, true, variables)).MediaListCollection;
				const matchingList = lists.find((list) => list.name === managedCollection.title);
				if (matchingList) results.push(...matchingList.entries.map((entry) => parseTitleDetails(entry.media)));
				const isLastChunkWithTarget = lists.some((list) => list.name === managedCollection.title && list.isCustomList === isCustomList) && lists.at(-1).name !== managedCollection.title;
				if (!hasNextChunk || isLastChunkWithTarget) break;
				variables.chunk += 1;
			}
			return results;
		}
	};

//#endregion
//#region src/AniList/GraphQL/TitleView.ts
	const titleViewQuery = `
query Query($id: Int) {
  Media(id: $id) {
    averageScore
    bannerImage
    coverImage {
      extraLarge
      large
      medium
    }
    chapters
    description
    format
    genres
    id
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
    synonyms
    tags {
      id
      name
    }
    title {
      english
      native
      romaji
    }
    volumes
  }
}
`;

//#endregion
//#region src/AniList/Implementations/Manga/main.ts
	var MangaImplementation = class {
		async getMangaDetails(mangaId) {
			return parseTitleDetails((await makeRequest(titleViewQuery, false, { id: Number(mangaId) })).Media);
		}
	};

//#endregion
//#region src/AniList/GraphQL/Tracking.ts
	const titleProgressQuery = `
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
`;
	const MediaListStatus = {
		CURRENT: {
			id: "CURRENT",
			label: "Reading"
		},
		PLANNING: {
			id: "PLANNING",
			label: "Planning"
		},
		COMPLETED: {
			id: "COMPLETED",
			label: "Completed"
		},
		DROPPED: {
			id: "DROPPED",
			label: "Dropped"
		},
		PAUSED: {
			id: "PAUSED",
			label: "Paused"
		},
		REPEATING: {
			id: "REPEATING",
			label: "Rereading"
		}
	};
	const titleProgressMutationMutation = `
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
`;
	const titleProgressDeletionMutation = `
mutation Mutation($deleteMediaListEntryId: Int) {
  DeleteMediaListEntry(id: $deleteMediaListEntryId) {
    deleted
  }
}
`;

//#endregion
//#region src/AniList/Implementations/MangaProgress/form.ts
	var TrackingForm = class extends Form {
		constructor(viewerId, sourceMangaId) {
			super();
			_defineProperty(this, "viewerId", void 0);
			_defineProperty(this, "sourceMangaId", void 0);
			_defineProperty(this, "loadRequest", void 0);
			_defineProperty(this, "titleProgress", void 0);
			_defineProperty(this, "error", void 0);
			_defineProperty(this, "requiresExplicitSubmission", true);
			this.viewerId = viewerId;
			this.sourceMangaId = sourceMangaId;
		}
		formWillAppear() {
			const queryVariables = {
				userId: this.viewerId,
				mediaId: this.sourceMangaId
			};
			this.loadRequest = makeRequest(titleProgressQuery, true, queryVariables).then((titleProgress) => {
				if (!this.titleProgress) this.titleProgress = titleProgress;
			}).catch((error) => {
				if (!error?.toString().includes("[404]")) this.error = error;
				const newTitleProgress = { MediaList: {
					advancedScores: {},
					completedAt: {
						day: null,
						month: null,
						year: null
					},
					createdAt: Date.now() / 1e3,
					customLists: {},
					hiddenFromStatusLists: false,
					notes: null,
					private: false,
					progress: 0,
					progressVolumes: 0,
					repeat: 0,
					score: 0,
					startedAt: {
						day: null,
						month: null,
						year: null
					},
					status: "CURRENT",
					updatedAt: Date.now() / 1e3
				} };
				if (!this.titleProgress) this.titleProgress = newTitleProgress;
			}).finally(() => {
				this.reloadForm();
			});
		}
		async formDidSubmit() {
			if (this.titleProgress == void 0) return;
			const titleProgress = this.titleProgress.MediaList;
			await makeRequest(titleProgressMutationMutation, true, {
				userId: this.viewerId,
				mediaId: this.sourceMangaId,
				status: titleProgress.status,
				score: titleProgress.score,
				progress: titleProgress.progress,
				progressVolumes: titleProgress.progressVolumes,
				repeat: titleProgress.repeat,
				private: titleProgress.private,
				notes: titleProgress.notes,
				hiddenFromStatusLists: titleProgress.hiddenFromStatusLists
			});
		}
		formDidCancel() {}
		getSections() {
			const sections = [];
			if (this.titleProgress == void 0 && this.error == void 0) return [Section("loading", [LabelRow("loading", { title: "Loading..." })])];
			if (this.error != void 0) return [Section("error", [LabelRow("error", {
				title: "Error",
				subtitle: this.error.toString()
			})])];
			const titleProgress = this.titleProgress.MediaList;
			if (titleProgress.id == void 0) sections.push(this.getNewMediaListEntrySection());
			const trackingSections = [
				...this.getProgressSections(),
				...this.getScoreSections(),
				this.getPrivacySection(),
				this.getNotesSection()
			];
			for (const trackingSection of trackingSections) sections.push(trackingSection);
			if (titleProgress.id != void 0) sections.push(this.getDeleteSection());
			return sections;
		}
		getNewMediaListEntrySection() {
			return Section("newMediaListEntry", [LabelRow("newMediaListEntry", {
				title: "New Media List Entry",
				subtitle: "Selecting Done will add this item to your media list"
			})]);
		}
		getProgressSections() {
			const titleProgress = this.titleProgress.MediaList;
			const statusOptions = [];
			for (const key of Object.keys(MediaListStatus)) {
				const statusOption = MediaListStatus[key];
				statusOptions.push({
					id: statusOption.id,
					title: statusOption.label
				});
			}
			const statusProps = {
				title: "Status",
				value: [titleProgress.status.toString()],
				minItemCount: 1,
				maxItemCount: 1,
				options: statusOptions,
				onValueChange: Application.Selector(this, "statusUpdate")
			};
			const chapterProgressProps = {
				title: "Chapters",
				subtitle: "The highest read chapter number",
				value: titleProgress.progress,
				minValue: 0,
				maxValue: 99999,
				stepValue: 1,
				loopOver: false,
				onValueChange: Application.Selector(this, "chapterProgressUpdate")
			};
			const volumeProgressProps = {
				title: "Volumes",
				subtitle: "The highest read volume number",
				value: titleProgress.progressVolumes,
				minValue: 0,
				maxValue: 99999,
				stepValue: 1,
				loopOver: false,
				onValueChange: Application.Selector(this, "volumeProgressUpdate")
			};
			const rereadCountProps = {
				title: "Reread Count",
				subtitle: "The amount of times you have reread the title",
				value: titleProgress.repeat,
				minValue: 0,
				maxValue: 99999,
				stepValue: 1,
				loopOver: false,
				onValueChange: Application.Selector(this, "rereadCountUpdate")
			};
			return [Section({
				id: "progress",
				header: "Progress"
			}, [
				SelectRow("status", statusProps),
				StepperRow("chapterProgress", chapterProgressProps),
				StepperRow("volumeProgress", volumeProgressProps),
				StepperRow("rereadCount", rereadCountProps)
			])];
		}
		async statusUpdate(newStatus) {
			this.titleProgress.MediaList.status = newStatus[0];
		}
		async chapterProgressUpdate(newChapterProgress) {
			this.titleProgress.MediaList.progress = newChapterProgress;
			this.reloadForm();
		}
		async volumeProgressUpdate(newVolumeProgress) {
			this.titleProgress.MediaList.progressVolumes = newVolumeProgress;
			this.reloadForm();
		}
		async rereadCountUpdate(newRereadCount) {
			this.titleProgress.MediaList.repeat = newRereadCount;
			this.reloadForm();
		}
		getScoreSections() {
			return [Section({
				id: "score",
				header: "Score"
			}, [StepperRow("score", {
				title: "Score",
				subtitle: "",
				value: this.titleProgress.MediaList.score,
				minValue: 0,
				maxValue: 10,
				stepValue: .1,
				loopOver: false,
				onValueChange: Application.Selector(this, "scoreUpdate")
			})])];
		}
		async scoreUpdate(newScore) {
			this.titleProgress.MediaList.score = Number(newScore.toFixed(1));
			this.reloadForm();
		}
		getPrivacySection() {
			const titleProgress = this.titleProgress.MediaList;
			const privateProps = {
				title: "Private",
				value: titleProgress.private,
				onValueChange: Application.Selector(this, "privateUpdate")
			};
			const hiddenFromStatusListsProps = {
				title: "Hidden From Status Lists",
				value: titleProgress.hiddenFromStatusLists,
				onValueChange: Application.Selector(this, "hiddenFromStatusListsUpdate")
			};
			return Section({
				id: "privacy",
				header: "Privacy"
			}, [ToggleRow("private", privateProps), ToggleRow("hiddenFromStatusLists", hiddenFromStatusListsProps)]);
		}
		async privateUpdate(newPrivate) {
			this.titleProgress.MediaList.private = newPrivate;
		}
		async hiddenFromStatusListsUpdate(newHiddenFromStatusLists) {
			this.titleProgress.MediaList.hiddenFromStatusLists = newHiddenFromStatusLists;
		}
		getNotesSection() {
			return Section({
				id: "notes",
				header: "Notes",
				footer: "Only you can see your notes"
			}, [InputRow("notes", {
				title: "Notes",
				value: this.titleProgress.MediaList.notes ?? "",
				onValueChange: Application.Selector(this, "updateNotes")
			})]);
		}
		async updateNotes(newNotes) {
			this.titleProgress.MediaList.notes = newNotes;
		}
		getDeleteSection() {
			return Section({
				id: "delete",
				footer: "Delete the title from your media list"
			}, [NavigationRow("delete", {
				title: "Delete",
				form: new DeletionForm(this.titleProgress.MediaList.id)
			})]);
		}
	};
	var DeletionForm = class extends Form {
		constructor(mediaListId) {
			super();
			_defineProperty(this, "mediaListId", void 0);
			this.mediaListId = mediaListId;
		}
		getSections() {
			if (this.mediaListId == null) return [Section("deleted", [LabelRow("deleted", {
				title: "Deleted",
				subtitle: "The title has been succesfully deleted from your media list"
			})])];
			return [Section({
				id: "delete",
				footer: "WARNING: All media list data will be deleted, this action can not be undone"
			}, [ButtonRow("delete", {
				title: "Delete",
				onSelect: Application.Selector(this, "onDeletion")
			})])];
		}
		async onDeletion() {
			if ((await makeRequest(titleProgressDeletionMutation, true, { deleteMediaListEntryId: this.mediaListId })).DeleteMediaListEntry.deleted) {
				this.mediaListId = null;
				this.reloadForm();
			}
		}
	};

//#endregion
//#region src/AniList/Implementations/MangaProgress/main.ts
	var MangaProgressImplementation = class {
		async getMangaProgressManagementForm(sourceManga) {
			const viewerId = Number(Application.getState("viewer-id"));
			if (isNaN(viewerId)) throw new Error("You are not authenticated, please log in through the AniList settings");
			return new TrackingForm(viewerId, Number(sourceManga.mangaId));
		}
		async getMangaProgress(sourceManga) {
			const viewerId = Number(Application.getState("viewer-id"));
			if (isNaN(viewerId)) throw new Error("You are not authenticated, please log in through the AniList settings");
			const queryVariables = {
				userId: viewerId,
				mediaId: Number(sourceManga.mangaId)
			};
			let mediaList;
			try {
				mediaList = (await makeRequest(titleProgressQuery, true, queryVariables)).MediaList;
			} catch (error) {
				if (!error?.toString().includes("[404]")) throw error;
				return;
			}
			const lastReadChapter = {
				chapterId: String(mediaList.progress),
				sourceManga,
				langCode: "unknown",
				chapNum: mediaList.progress,
				volume: mediaList.progressVolumes
			};
			const lastReadTime = /* @__PURE__ */ new Date(0);
			lastReadTime.setUTCSeconds(mediaList.updatedAt);
			return {
				sourceManga,
				lastReadChapter,
				lastReadTime,
				userRating: mediaList.score
			};
		}
		async processChapterReadActionQueue(actions) {
			const viewerId = Number(Application.getState("viewer-id"));
			const trackedReadActions = {
				successfulItems: [],
				failedItems: []
			};
			if (isNaN(viewerId)) return trackedReadActions;
			const highestChapters = /* @__PURE__ */ new Map();
			for (const action of actions) if ((highestChapters.get(action.sourceManga.mangaId) ?? 0) < Math.floor(action.chapterNum)) highestChapters.set(action.sourceManga.mangaId, Math.floor(action.chapterNum));
			for (const action of actions) {
				if ((highestChapters.get(action.sourceManga.mangaId) ?? 0) != Math.floor(action.chapterNum)) {
					trackedReadActions.successfulItems.push(action.id);
					continue;
				}
				try {
					const queryVariables = {
						userId: viewerId,
						mediaId: Number(action.sourceManga.mangaId)
					};
					let mediaList;
					try {
						mediaList = (await makeRequest(titleProgressQuery, true, queryVariables)).MediaList;
					} catch (error) {
						if (!error?.toString().includes("[404]")) {
							trackedReadActions.failedItems.push(action.id);
							continue;
						}
					}
					if (mediaList?.progress && mediaList.progress >= action.chapterNum) {
						trackedReadActions.successfulItems.push(action.id);
						continue;
					}
					const mutationVariables = {
						userId: viewerId,
						mediaId: Number(action.sourceManga.mangaId),
						progress: Math.floor(action.chapterNum)
					};
					if (!mediaList) mutationVariables.status = MediaListStatus.CURRENT.id;
					if (action.chapterVolume && (mediaList?.progressVolumes ?? 0) < Math.floor(action.chapterVolume)) mutationVariables.progressVolumes = Math.floor(action.chapterVolume) - 1;
					await makeRequest(titleProgressMutationMutation, true, mutationVariables);
					trackedReadActions.successfulItems.push(action.id);
				} catch {
					trackedReadActions.failedItems.push(action.id);
				}
			}
			return trackedReadActions;
		}
	};

//#endregion
//#region src/AniList/GraphQL/SearchFilters.ts
	const genresQuery = `
query Query {
  GenreCollection
}
`;
	const tagsQuery = `
query Query {
  MediaTagCollection {
    isAdult
    name
  }
}
`;

//#endregion
//#region src/AniList/Implementations/SearchResults/form.ts
	var AniListAdvancedSearchForm = class extends AdvancedSearchForm {
		constructor(searchQuery) {
			super();
			_defineProperty(this, "genreOptions", []);
			_defineProperty(this, "tagOptions", []);
			_defineProperty(this, "optionsLoaded", false);
			_defineProperty(this, "loadError", void 0);
			_defineProperty(this, "genres", void 0);
			_defineProperty(this, "formats", void 0);
			_defineProperty(this, "statuses", void 0);
			_defineProperty(this, "countryOfOrigin", void 0);
			_defineProperty(this, "sourceMaterials", void 0);
			_defineProperty(this, "startYears", void 0);
			_defineProperty(this, "chapterCounts", void 0);
			_defineProperty(this, "volumeCounts", void 0);
			_defineProperty(this, "adult", void 0);
			_defineProperty(this, "doujin", void 0);
			_defineProperty(this, "trackedTitles", void 0);
			_defineProperty(this, "tags", void 0);
			this.loadOptions().then(({ genres, tags }) => {
				this.genreOptions = genres.GenreCollection.map((x) => ({
					id: x.replaceAll(" ", "_"),
					title: x
				}));
				this.tagOptions = tags.MediaTagCollection.map((x) => ({
					id: x.name.replaceAll(" ", "_").replaceAll("'", "?"),
					title: x.name
				}));
				this.optionsLoaded = true;
			}).catch((error) => {
				this.loadError = error;
			}).finally(() => {
				this.reloadForm();
			});
			const meta = searchQuery.metadata ?? {};
			this.genres = { ...meta.genres };
			this.formats = { ...meta.formats };
			this.statuses = { ...meta.publishingStatuses };
			this.countryOfOrigin = meta.countryOfOrigin ?? [];
			this.sourceMaterials = meta.sourceMaterials ?? [];
			this.startYears = meta.startYears ?? "";
			this.chapterCounts = meta.chapterCounts ?? "";
			this.volumeCounts = meta.volumeCounts ?? "";
			this.adult = meta.adult ?? "";
			this.doujin = meta.doujin ?? "";
			this.trackedTitles = meta.trackedTitles ?? "";
			this.tags = { ...meta.tags };
		}
		async loadOptions() {
			if (Number(Application.getState("search-filters-query-date") ?? 0) + 604800 > (/* @__PURE__ */ new Date()).valueOf() / 1e3) return {
				genres: JSON.parse(Application.getState("genres")),
				tags: JSON.parse(Application.getState("tags"))
			};
			const genres = await makeRequest(genresQuery, false);
			const tags = await makeRequest(tagsQuery, false);
			Application.setState(JSON.stringify(genres), "genres");
			Application.setState(JSON.stringify(tags), "tags");
			Application.setState(String((/* @__PURE__ */ new Date()).valueOf() / 1e3), "search-filters-query-date");
			return {
				genres,
				tags
			};
		}
		getSections() {
			if (this.loadError) return [Section("error", [LabelRow("error", {
				title: "Error",
				subtitle: this.loadError.toString()
			})])];
			if (!this.optionsLoaded) return [Section("loading", [LabelRow("loading", { title: "Loading..." })])];
			return [
				Section({ id: "filters" }, [TriStateSelectRow("genres", {
					title: "Genres",
					layout: "flow",
					value: this.genres,
					items: this.genreOptions,
					allowExclusion: true,
					allowEmptySelection: true,
					onValueChange: Application.Selector(this, "handleGenresChange")
				})]),
				TriStateSelectSection(this, {
					id: "formats",
					header: "Formats",
					layout: "list",
					value: this.formats,
					items: Object.values(MediaFormat).map((x) => ({
						id: x.id,
						title: x.label
					})),
					allowExclusion: true,
					allowEmptySelection: true
				}),
				TriStateSelectSection(this, {
					id: "publishing-statuses",
					header: "Publishing Statuses",
					layout: "list",
					value: this.statuses,
					items: Object.values(MediaStatus).map((x) => ({
						id: x.id,
						title: x.label
					})),
					allowExclusion: true,
					allowEmptySelection: true
				}),
				SelectSection(this, {
					id: "country-of-origin",
					header: "Country of Origin",
					layout: "list",
					value: this.countryOfOrigin,
					items: Object.values(CountryCode).map((x) => ({
						id: x.id,
						title: x.label
					})),
					minItemCount: 0,
					maxItemCount: 1
				}),
				Section({ id: "advanced-filters" }, [SelectRow("source-materials", {
					title: "Source Materials",
					layout: "list",
					value: this.sourceMaterials,
					options: Object.values(MediaSourceMaterial).map((x) => ({
						id: x.id,
						title: x.label
					})),
					minItemCount: 0,
					maxItemCount: Object.values(MediaSourceMaterial).length,
					onValueChange: Application.Selector(this, "handleSourceMaterialsChange")
				})]),
				TriStateSelectSection(this, {
					id: "flags",
					header: "Flags",
					layout: "list",
					value: {
						...this.adult ? { adult: this.adult } : {},
						...this.doujin ? { doujin: this.doujin } : {},
						...this.trackedTitles ? { trackedTitles: this.trackedTitles } : {}
					},
					items: [
						{
							id: "adult",
							title: "Adult"
						},
						{
							id: "doujin",
							title: "Doujin"
						},
						{
							id: "trackedTitles",
							title: "Tracked Titles"
						}
					],
					allowExclusion: true,
					allowEmptySelection: true
				}),
				Section({ id: "tags" }, [TriStateSelectRow("tags", {
					title: "Tags",
					layout: "flow",
					value: this.tags,
					items: this.tagOptions,
					allowExclusion: true,
					allowEmptySelection: true,
					onValueChange: Application.Selector(this, "handleTagsChange")
				})]),
				Section({
					id: "ranges",
					header: "Ranges",
					footer: "For each field, give a single value or two values separated by \"-\" for a range."
				}, [
					InputRow("start-years", {
						title: "Start Years",
						value: this.startYears,
						onValueChange: Application.Selector(this, "handleStartYearsChange")
					}),
					InputRow("chapter-counts", {
						title: "Chapter Counts",
						value: this.chapterCounts,
						onValueChange: Application.Selector(this, "handleChapterCountsChange")
					}),
					InputRow("volume-counts", {
						title: "Volume Counts",
						value: this.volumeCounts,
						onValueChange: Application.Selector(this, "handleVolumeCountsChange")
					})
				])
			];
		}
		async handleGenresChange(value) {
			this.genres = value;
		}
		async handleSourceMaterialsChange(value) {
			this.sourceMaterials = value;
		}
		async handleStartYearsChange(value) {
			this.startYears = value;
		}
		async handleChapterCountsChange(value) {
			this.chapterCounts = value;
		}
		async handleVolumeCountsChange(value) {
			this.volumeCounts = value;
		}
		async handleFlagsChange(value) {
			this.adult = value.adult ?? "";
			this.doujin = value.doujin ?? "";
			this.trackedTitles = value.trackedTitles ?? "";
		}
		async handleTagsChange(value) {
			this.tags = value;
		}
		getSearchQueryMetadata() {
			const result = {};
			if (Object.keys(this.genres).length > 0) result.genres = this.genres;
			if (Object.keys(this.formats).length > 0) result.formats = this.formats;
			if (Object.keys(this.statuses).length > 0) result.publishingStatuses = this.statuses;
			if (this.countryOfOrigin.length === 1) result.countryOfOrigin = this.countryOfOrigin;
			if (this.sourceMaterials.length > 0) result.sourceMaterials = this.sourceMaterials;
			if (this.startYears) result.startYears = this.startYears;
			if (this.chapterCounts) result.chapterCounts = this.chapterCounts;
			if (this.volumeCounts) result.volumeCounts = this.volumeCounts;
			if (this.adult) result.adult = this.adult;
			if (this.doujin) result.doujin = this.doujin;
			if (this.trackedTitles) result.trackedTitles = this.trackedTitles;
			if (Object.keys(this.tags).length > 0) result.tags = this.tags;
			return result;
		}
	};

//#endregion
//#region src/AniList/Implementations/SearchResults/main.ts
	var SearchResultsImplementation = class extends MangaImplementation {
		async getAdvancedSearchForm(query) {
			return new AniListAdvancedSearchForm(query);
		}
		async getSortingOptions(query) {
			const sortingOptions = [];
			for (const key of Object.keys(MediaSort)) {
				const sortingOption = MediaSort[key];
				sortingOptions.push({
					id: sortingOption.id,
					label: sortingOption.label
				});
			}
			return sortingOptions;
		}
		async getSearchResults(query, metadata, sortingOption) {
			let needsAuth = false;
			const variables = {
				page: metadata ?? 1,
				sort: sortingOption.id
			};
			if (query.title) variables.search = query.title;
			const meta = query.metadata ?? {};
			if (meta.genres) {
				const includedGenres = [];
				const excludedGenres = [];
				for (const [id, state] of Object.entries(meta.genres)) switch (state) {
					case "included":
						includedGenres.push(id.replaceAll("_", " "));
						break;
					case "excluded":
						excludedGenres.push(id.replaceAll("_", " "));
						break;
				}
				if (includedGenres.length > 0) variables.genreIn = includedGenres;
				if (excludedGenres.length > 0) variables.genreNotIn = excludedGenres;
			}
			if (meta.formats) {
				const includedFormats = [];
				const excludedFormats = [];
				for (const [id, state] of Object.entries(meta.formats)) switch (state) {
					case "included":
						includedFormats.push(id);
						break;
					case "excluded":
						excludedFormats.push(id);
						break;
				}
				if (includedFormats.length > 0) variables.formatIn = includedFormats;
				if (excludedFormats.length > 0) variables.formatNotIn = excludedFormats;
			}
			if (meta.publishingStatuses) {
				const includedStatuses = [];
				const excludedStatuses = [];
				for (const [id, state] of Object.entries(meta.publishingStatuses)) switch (state) {
					case "included":
						includedStatuses.push(id);
						break;
					case "excluded":
						excludedStatuses.push(id);
						break;
				}
				if (includedStatuses.length > 0) variables.statusIn = includedStatuses;
				if (excludedStatuses.length > 0) variables.statusNotIn = excludedStatuses;
			}
			if (meta.countryOfOrigin) variables.countryOfOrigin = meta.countryOfOrigin[0];
			if (meta.sourceMaterials && meta.sourceMaterials.length > 0) variables.sourceIn = meta.sourceMaterials;
			if (meta.startYears) {
				const startYears = meta.startYears.split("-").map((x) => Number(x));
				if (startYears.length > 0 && startYears.length <= 2 && !startYears.includes(NaN) && startYears.every((x) => x >= 0 && x <= 9999)) switch (startYears.length) {
					case 1:
						variables.startDateGreater = Number((startYears[0] - 1).toString().padStart(4, "0")) * 1e4;
						variables.startDateLesser = Number((startYears[0] + 1).toString().padStart(4, "0")) * 1e4;
						break;
					case 2:
						if (startYears[0] <= startYears[1]) {
							variables.startDateGreater = Number(startYears[0].toString().padStart(4, "0")) * 1e4;
							variables.startDateLesser = Number(startYears[1].toString().padStart(4, "0")) * 1e4;
						}
						break;
				}
			}
			if (meta.chapterCounts) {
				const chapterCounts = meta.chapterCounts.split("-").map((x) => Number(x));
				if (chapterCounts.length > 0 && chapterCounts.length <= 2 && !chapterCounts.includes(NaN) && chapterCounts.every((x) => x >= 0)) switch (chapterCounts.length) {
					case 1:
						variables.chaptersGreater = chapterCounts[0] - 1;
						variables.chaptersLesser = chapterCounts[0] + 1;
						break;
					case 2:
						if (chapterCounts[0] <= chapterCounts[1]) {
							variables.chaptersGreater = chapterCounts[0];
							variables.chaptersLesser = chapterCounts[1];
						}
						break;
				}
			}
			if (meta.volumeCounts) {
				const volumeCounts = meta.volumeCounts.split("-").map((x) => Number(x));
				if (volumeCounts.length > 0 && volumeCounts.length <= 2 && !volumeCounts.includes(NaN) && volumeCounts.every((x) => x >= 0)) switch (volumeCounts.length) {
					case 1:
						variables.volumesGreater = volumeCounts[0] - 1;
						variables.volumesLesser = volumeCounts[0] + 1;
						break;
					case 2:
						if (volumeCounts[0] <= volumeCounts[1]) {
							variables.volumesGreater = volumeCounts[0];
							variables.volumesLesser = volumeCounts[1];
						}
						break;
				}
			}
			switch (meta.adult) {
				case "included":
					variables.isAdult = true;
					break;
				case "excluded":
					variables.isAdult = false;
					break;
			}
			switch (meta.doujin) {
				case "included":
					variables.isLicensed = false;
					break;
				case "excluded":
					variables.isLicensed = true;
					break;
			}
			switch (meta.trackedTitles) {
				case "included":
					variables.onList = true;
					needsAuth = true;
					break;
				case "excluded":
					variables.onList = false;
					needsAuth = true;
					break;
			}
			if (meta.tags) {
				const includedTags = [];
				const excludedTags = [];
				for (const [id, state] of Object.entries(meta.tags)) switch (state) {
					case "included":
						includedTags.push(id.replaceAll("_", " ").replaceAll("?", "'"));
						break;
					case "excluded":
						excludedTags.push(id.replaceAll("_", " ").replaceAll("?", "'"));
						break;
				}
				if (includedTags.length > 0) variables.tagIn = includedTags;
				if (excludedTags.length > 0) variables.tagNotIn = excludedTags;
			}
			return getItems(discoverSectionsAndSearchQuery, variables, needsAuth, metadata);
		}
	};

//#endregion
//#region src/AniList/Implementations/SettingsForm/main.ts
	var SettingsFormImplementation = class {
		async getSettingsForm() {
			return new SettingsForm();
		}
	};

//#endregion
//#region src/AniList/Services/Interceptor.ts
	var AniListInterceptor = class extends PaperbackInterceptor {
		async interceptRequest(request) {
			return request;
		}
		async interceptResponse(request, response, data) {
			return data;
		}
	};

//#endregion
//#region src/AniList/main.ts
	var AniListExtension = class {
		constructor() {
			_defineProperty(this, "mainRateLimiter", new BasicRateLimiter("main", {
				numberOfRequests: 1,
				bufferInterval: 2,
				ignoreImages: true
			}));
			_defineProperty(this, "mainInterceptor", new AniListInterceptor("main"));
		}
		async initialise() {
			this.mainRateLimiter.registerInterceptor();
			this.mainInterceptor.registerInterceptor();
		}
	};
	applyMixins(AniListExtension, [
		SettingsFormImplementation,
		SearchResultsImplementation,
		DiscoverSectionImplementation,
		MangaImplementation,
		MangaProgressImplementation,
		ManagedCollectionImplementation
	]);
	const AniList = new AniListExtension();

//#endregion
//#region src/AniList/pbconfig.ts
	var pbconfig_default = {
		name: "AniList",
		description: "Extension that integrates with anilist.co for tracking and collection management.",
		version: "1.0.0-alpha.15",
		icon: "icon.png",
		language: "en",
		contentRating: ContentRating.EVERYONE,
		capabilities: [
			SourceIntents.DISCOVER_SECTION_PROVIDING,
			SourceIntents.PROGRESS_PROVIDING,
			SourceIntents.SETTINGS_FORM_PROVIDING,
			SourceIntents.SEARCH_RESULT_PROVIDING,
			SourceIntents.MANAGED_COLLECTION_PROVIDING
		],
		badges: [],
		developers: [{
			name: "Celarye",
			website: "https://celarye.dev",
			github: "https://github.com/Celarye"
		}]
	};

//#endregion
//#region node_modules/chai/index.js
	var __defProp = Object.defineProperty;
	var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
		enumerable: true,
		configurable: true,
		writable: true,
		value
	}) : obj[key] = value;
	var __name = (target, value) => __defProp(target, "name", {
		value,
		configurable: true
	});
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	var utils_exports = {};
	__export(utils_exports, {
		addChainableMethod: () => addChainableMethod,
		addLengthGuard: () => addLengthGuard,
		addMethod: () => addMethod,
		addProperty: () => addProperty,
		checkError: () => check_error_exports,
		compareByInspect: () => compareByInspect,
		eql: () => deep_eql_default,
		events: () => events,
		expectTypes: () => expectTypes,
		flag: () => flag,
		getActual: () => getActual,
		getMessage: () => getMessage2,
		getName: () => getName,
		getOperator: () => getOperator,
		getOwnEnumerableProperties: () => getOwnEnumerableProperties,
		getOwnEnumerablePropertySymbols: () => getOwnEnumerablePropertySymbols,
		getPathInfo: () => getPathInfo,
		hasProperty: () => hasProperty,
		inspect: () => inspect2,
		isNaN: () => isNaN2,
		isNumeric: () => isNumeric,
		isProxyEnabled: () => isProxyEnabled,
		isRegExp: () => isRegExp2,
		objDisplay: () => objDisplay,
		overwriteChainableMethod: () => overwriteChainableMethod,
		overwriteMethod: () => overwriteMethod,
		overwriteProperty: () => overwriteProperty,
		proxify: () => proxify,
		test: () => test,
		transferFlags: () => transferFlags,
		type: () => type
	});
	var check_error_exports = {};
	__export(check_error_exports, {
		compatibleConstructor: () => compatibleConstructor,
		compatibleInstance: () => compatibleInstance,
		compatibleMessage: () => compatibleMessage,
		getConstructorName: () => getConstructorName,
		getMessage: () => getMessage
	});
	function isErrorInstance(obj) {
		return obj instanceof Error || Object.prototype.toString.call(obj) === "[object Error]";
	}
	__name(isErrorInstance, "isErrorInstance");
	function isRegExp(obj) {
		return Object.prototype.toString.call(obj) === "[object RegExp]";
	}
	__name(isRegExp, "isRegExp");
	function compatibleInstance(thrown, errorLike) {
		return isErrorInstance(errorLike) && thrown === errorLike;
	}
	__name(compatibleInstance, "compatibleInstance");
	function compatibleConstructor(thrown, errorLike) {
		if (isErrorInstance(errorLike)) return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
		else if ((typeof errorLike === "object" || typeof errorLike === "function") && errorLike.prototype) return thrown.constructor === errorLike || thrown instanceof errorLike;
		return false;
	}
	__name(compatibleConstructor, "compatibleConstructor");
	function compatibleMessage(thrown, errMatcher) {
		const comparisonString = typeof thrown === "string" ? thrown : thrown.message;
		if (isRegExp(errMatcher)) return errMatcher.test(comparisonString);
		else if (typeof errMatcher === "string") return comparisonString.indexOf(errMatcher) !== -1;
		return false;
	}
	__name(compatibleMessage, "compatibleMessage");
	function getConstructorName(errorLike) {
		let constructorName = errorLike;
		if (isErrorInstance(errorLike)) constructorName = errorLike.constructor.name;
		else if (typeof errorLike === "function") {
			constructorName = errorLike.name;
			if (constructorName === "") constructorName = new errorLike().name || constructorName;
		}
		return constructorName;
	}
	__name(getConstructorName, "getConstructorName");
	function getMessage(errorLike) {
		let msg = "";
		if (errorLike && errorLike.message) msg = errorLike.message;
		else if (typeof errorLike === "string") msg = errorLike;
		return msg;
	}
	__name(getMessage, "getMessage");
	function flag(obj, key, value) {
		let flags = obj.__flags || (obj.__flags = /* @__PURE__ */ Object.create(null));
		if (arguments.length === 3) flags[key] = value;
		else return flags[key];
	}
	__name(flag, "flag");
	function test(obj, args) {
		let negate = flag(obj, "negate"), expr = args[0];
		return negate ? !expr : expr;
	}
	__name(test, "test");
	function type(obj) {
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		const stringTag = obj[Symbol.toStringTag];
		if (typeof stringTag === "string") return stringTag;
		return Object.prototype.toString.call(obj).slice(8, -1);
	}
	__name(type, "type");
	var canElideFrames = "captureStackTrace" in Error;
	var _AssertionError = class _AssertionError extends Error {
		constructor(message = "Unspecified AssertionError", props, ssf) {
			super(message);
			__publicField(this, "message");
			this.message = message;
			if (canElideFrames) Error.captureStackTrace(this, ssf || _AssertionError);
			for (const key in props) if (!(key in this)) this[key] = props[key];
		}
		get name() {
			return "AssertionError";
		}
		get ok() {
			return false;
		}
		toJSON(stack) {
			return {
				...this,
				name: this.name,
				message: this.message,
				ok: false,
				stack: stack !== false ? this.stack : void 0
			};
		}
	};
	__name(_AssertionError, "AssertionError");
	var AssertionError = _AssertionError;
	function expectTypes(obj, types) {
		let flagMsg = flag(obj, "message");
		let ssfi = flag(obj, "ssfi");
		flagMsg = flagMsg ? flagMsg + ": " : "";
		obj = flag(obj, "object");
		types = types.map(function(t) {
			return t.toLowerCase();
		});
		types.sort();
		let str = types.map(function(t, index) {
			let art = ~[
				"a",
				"e",
				"i",
				"o",
				"u"
			].indexOf(t.charAt(0)) ? "an" : "a";
			return (types.length > 1 && index === types.length - 1 ? "or " : "") + art + " " + t;
		}).join(", ");
		let objType = type(obj).toLowerCase();
		if (!types.some(function(expected) {
			return objType === expected;
		})) throw new AssertionError(flagMsg + "object tested must be " + str + ", but " + objType + " given", void 0, ssfi);
	}
	__name(expectTypes, "expectTypes");
	function getActual(obj, args) {
		return args.length > 4 ? args[4] : obj._obj;
	}
	__name(getActual, "getActual");
	var ansiColors = {
		bold: ["1", "22"],
		dim: ["2", "22"],
		italic: ["3", "23"],
		underline: ["4", "24"],
		inverse: ["7", "27"],
		hidden: ["8", "28"],
		strike: ["9", "29"],
		black: ["30", "39"],
		red: ["31", "39"],
		green: ["32", "39"],
		yellow: ["33", "39"],
		blue: ["34", "39"],
		magenta: ["35", "39"],
		cyan: ["36", "39"],
		white: ["37", "39"],
		brightblack: ["30;1", "39"],
		brightred: ["31;1", "39"],
		brightgreen: ["32;1", "39"],
		brightyellow: ["33;1", "39"],
		brightblue: ["34;1", "39"],
		brightmagenta: ["35;1", "39"],
		brightcyan: ["36;1", "39"],
		brightwhite: ["37;1", "39"],
		grey: ["90", "39"]
	};
	var styles = {
		special: "cyan",
		number: "yellow",
		bigint: "yellow",
		boolean: "yellow",
		undefined: "grey",
		null: "bold",
		string: "green",
		symbol: "green",
		date: "magenta",
		regexp: "red"
	};
	var truncator = "…";
	function colorise(value, styleType) {
		const color = ansiColors[styles[styleType]] || ansiColors[styleType] || "";
		if (!color) return String(value);
		return `\x1B[${color[0]}m${String(value)}\x1B[${color[1]}m`;
	}
	__name(colorise, "colorise");
	function normaliseOptions({ showHidden = false, depth = 2, colors = false, customInspect = true, showProxy = false, maxArrayLength = Infinity, breakLength = Infinity, seen = [], truncate: truncate2 = Infinity, stylize = String } = {}, inspect3) {
		const options = {
			showHidden: Boolean(showHidden),
			depth: Number(depth),
			colors: Boolean(colors),
			customInspect: Boolean(customInspect),
			showProxy: Boolean(showProxy),
			maxArrayLength: Number(maxArrayLength),
			breakLength: Number(breakLength),
			truncate: Number(truncate2),
			seen,
			inspect: inspect3,
			stylize
		};
		if (options.colors) options.stylize = colorise;
		return options;
	}
	__name(normaliseOptions, "normaliseOptions");
	function isHighSurrogate(char) {
		return char >= "\ud800" && char <= "\udbff";
	}
	__name(isHighSurrogate, "isHighSurrogate");
	function truncate(string, length, tail = truncator) {
		string = String(string);
		const tailLength = tail.length;
		const stringLength = string.length;
		if (tailLength > length && stringLength > tailLength) return tail;
		if (stringLength > length && stringLength > tailLength) {
			let end = length - tailLength;
			if (end > 0 && isHighSurrogate(string[end - 1])) end = end - 1;
			return `${string.slice(0, end)}${tail}`;
		}
		return string;
	}
	__name(truncate, "truncate");
	function inspectList(list, options, inspectItem, separator = ", ") {
		inspectItem = inspectItem || options.inspect;
		const size = list.length;
		if (size === 0) return "";
		const originalLength = options.truncate;
		let output = "";
		let peek = "";
		let truncated = "";
		for (let i = 0; i < size; i += 1) {
			const last = i + 1 === list.length;
			const secondToLast = i + 2 === list.length;
			truncated = `${truncator}(${list.length - i})`;
			const value = list[i];
			options.truncate = originalLength - output.length - (last ? 0 : separator.length);
			const string = peek || inspectItem(value, options) + (last ? "" : separator);
			const nextLength = output.length + string.length;
			const truncatedLength = nextLength + truncated.length;
			if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) break;
			if (!last && !secondToLast && truncatedLength > originalLength) break;
			peek = last ? "" : inspectItem(list[i + 1], options) + (secondToLast ? "" : separator);
			if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) break;
			output += string;
			if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
				truncated = `${truncator}(${list.length - i - 1})`;
				break;
			}
			truncated = "";
		}
		return `${output}${truncated}`;
	}
	__name(inspectList, "inspectList");
	function quoteComplexKey(key) {
		if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) return key;
		return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, "\"").replace(/(^"|"$)/g, "'");
	}
	__name(quoteComplexKey, "quoteComplexKey");
	function inspectProperty([key, value], options) {
		options.truncate -= 2;
		if (typeof key === "string") key = quoteComplexKey(key);
		else if (typeof key !== "number") key = `[${options.inspect(key, options)}]`;
		options.truncate -= key.length;
		value = options.inspect(value, options);
		return `${key}: ${value}`;
	}
	__name(inspectProperty, "inspectProperty");
	function inspectArray(array, options) {
		const nonIndexProperties = Object.keys(array).slice(array.length);
		if (!array.length && !nonIndexProperties.length) return "[]";
		options.truncate -= 4;
		const listContents = inspectList(array, options);
		options.truncate -= listContents.length;
		let propertyContents = "";
		if (nonIndexProperties.length) propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options, inspectProperty);
		return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ""} ]`;
	}
	__name(inspectArray, "inspectArray");
	var getArrayName = /* @__PURE__ */ __name((array) => {
		if (typeof Buffer === "function" && array instanceof Buffer) return "Buffer";
		if (array[Symbol.toStringTag]) return array[Symbol.toStringTag];
		return array.constructor.name;
	}, "getArrayName");
	function inspectTypedArray(array, options) {
		const name = getArrayName(array);
		options.truncate -= name.length + 4;
		const nonIndexProperties = Object.keys(array).slice(array.length);
		if (!array.length && !nonIndexProperties.length) return `${name}[]`;
		let output = "";
		for (let i = 0; i < array.length; i++) {
			const string = `${options.stylize(truncate(array[i], options.truncate), "number")}${i === array.length - 1 ? "" : ", "}`;
			options.truncate -= string.length;
			if (array[i] !== array.length && options.truncate <= 3) {
				output += `${truncator}(${array.length - array[i] + 1})`;
				break;
			}
			output += string;
		}
		let propertyContents = "";
		if (nonIndexProperties.length) propertyContents = inspectList(nonIndexProperties.map((key) => [key, array[key]]), options, inspectProperty);
		return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ""} ]`;
	}
	__name(inspectTypedArray, "inspectTypedArray");
	function inspectDate(dateObject, options) {
		const stringRepresentation = dateObject.toJSON();
		if (stringRepresentation === null) return "Invalid Date";
		const split = stringRepresentation.split("T");
		const date = split[0];
		return options.stylize(`${date}T${truncate(split[1], options.truncate - date.length - 1)}`, "date");
	}
	__name(inspectDate, "inspectDate");
	function inspectFunction(func, options) {
		const functionType = func[Symbol.toStringTag] || "Function";
		const name = func.name;
		if (!name) return options.stylize(`[${functionType}]`, "special");
		return options.stylize(`[${functionType} ${truncate(name, options.truncate - 11)}]`, "special");
	}
	__name(inspectFunction, "inspectFunction");
	function inspectMapEntry([key, value], options) {
		options.truncate -= 4;
		key = options.inspect(key, options);
		options.truncate -= key.length;
		value = options.inspect(value, options);
		return `${key} => ${value}`;
	}
	__name(inspectMapEntry, "inspectMapEntry");
	function mapToEntries(map) {
		const entries = [];
		map.forEach((value, key) => {
			entries.push([key, value]);
		});
		return entries;
	}
	__name(mapToEntries, "mapToEntries");
	function inspectMap(map, options) {
		if (map.size === 0) return "Map{}";
		options.truncate -= 7;
		return `Map{ ${inspectList(mapToEntries(map), options, inspectMapEntry)} }`;
	}
	__name(inspectMap, "inspectMap");
	var isNaN$1 = Number.isNaN || ((i) => i !== i);
	function inspectNumber(number, options) {
		if (isNaN$1(number)) return options.stylize("NaN", "number");
		if (number === Infinity) return options.stylize("Infinity", "number");
		if (number === -Infinity) return options.stylize("-Infinity", "number");
		if (number === 0) return options.stylize(1 / number === Infinity ? "+0" : "-0", "number");
		return options.stylize(truncate(String(number), options.truncate), "number");
	}
	__name(inspectNumber, "inspectNumber");
	function inspectBigInt(number, options) {
		let nums = truncate(number.toString(), options.truncate - 1);
		if (nums !== truncator) nums += "n";
		return options.stylize(nums, "bigint");
	}
	__name(inspectBigInt, "inspectBigInt");
	function inspectRegExp(value, options) {
		const flags = value.toString().split("/")[2];
		const sourceLength = options.truncate - (2 + flags.length);
		const source = value.source;
		return options.stylize(`/${truncate(source, sourceLength)}/${flags}`, "regexp");
	}
	__name(inspectRegExp, "inspectRegExp");
	function arrayFromSet(set2) {
		const values = [];
		set2.forEach((value) => {
			values.push(value);
		});
		return values;
	}
	__name(arrayFromSet, "arrayFromSet");
	function inspectSet(set2, options) {
		if (set2.size === 0) return "Set{}";
		options.truncate -= 7;
		return `Set{ ${inspectList(arrayFromSet(set2), options)} }`;
	}
	__name(inspectSet, "inspectSet");
	var stringEscapeChars = /* @__PURE__ */ new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", "g");
	var escapeCharacters = {
		"\b": "\\b",
		"	": "\\t",
		"\n": "\\n",
		"\f": "\\f",
		"\r": "\\r",
		"'": "\\'",
		"\\": "\\\\"
	};
	var hex = 16;
	var unicodeLength = 4;
	function escape(char) {
		return escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString(hex)}`.slice(-unicodeLength)}`;
	}
	__name(escape, "escape");
	function inspectString(string, options) {
		if (stringEscapeChars.test(string)) string = string.replace(stringEscapeChars, escape);
		return options.stylize(`'${truncate(string, options.truncate - 2)}'`, "string");
	}
	__name(inspectString, "inspectString");
	function inspectSymbol(value) {
		if ("description" in Symbol.prototype) return value.description ? `Symbol(${value.description})` : "Symbol()";
		return value.toString();
	}
	__name(inspectSymbol, "inspectSymbol");
	var promise_default = /* @__PURE__ */ __name(() => "Promise{…}", "getPromiseValue");
	function inspectObject(object, options) {
		const properties = Object.getOwnPropertyNames(object);
		const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
		if (properties.length === 0 && symbols.length === 0) return "{}";
		options.truncate -= 4;
		options.seen = options.seen || [];
		if (options.seen.includes(object)) return "[Circular]";
		options.seen.push(object);
		const propertyContents = inspectList(properties.map((key) => [key, object[key]]), options, inspectProperty);
		const symbolContents = inspectList(symbols.map((key) => [key, object[key]]), options, inspectProperty);
		options.seen.pop();
		let sep = "";
		if (propertyContents && symbolContents) sep = ", ";
		return `{ ${propertyContents}${sep}${symbolContents} }`;
	}
	__name(inspectObject, "inspectObject");
	var toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
	function inspectClass(value, options) {
		let name = "";
		if (toStringTag && toStringTag in value) name = value[toStringTag];
		name = name || value.constructor.name;
		if (!name || name === "_class") name = "<Anonymous Class>";
		options.truncate -= name.length;
		return `${name}${inspectObject(value, options)}`;
	}
	__name(inspectClass, "inspectClass");
	function inspectArguments(args, options) {
		if (args.length === 0) return "Arguments[]";
		options.truncate -= 13;
		return `Arguments[ ${inspectList(args, options)} ]`;
	}
	__name(inspectArguments, "inspectArguments");
	var errorKeys = [
		"stack",
		"line",
		"column",
		"name",
		"message",
		"fileName",
		"lineNumber",
		"columnNumber",
		"number",
		"description",
		"cause"
	];
	function inspectObject2(error, options) {
		const properties = Object.getOwnPropertyNames(error).filter((key) => errorKeys.indexOf(key) === -1);
		const name = error.name;
		options.truncate -= name.length;
		let message = "";
		if (typeof error.message === "string") message = truncate(error.message, options.truncate);
		else properties.unshift("message");
		message = message ? `: ${message}` : "";
		options.truncate -= message.length + 5;
		options.seen = options.seen || [];
		if (options.seen.includes(error)) return "[Circular]";
		options.seen.push(error);
		const propertyContents = inspectList(properties.map((key) => [key, error[key]]), options, inspectProperty);
		return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ""}`;
	}
	__name(inspectObject2, "inspectObject");
	function inspectAttribute([key, value], options) {
		options.truncate -= 3;
		if (!value) return `${options.stylize(String(key), "yellow")}`;
		return `${options.stylize(String(key), "yellow")}=${options.stylize(`"${value}"`, "string")}`;
	}
	__name(inspectAttribute, "inspectAttribute");
	function inspectNodeCollection(collection, options) {
		return inspectList(collection, options, inspectNode, "\n");
	}
	__name(inspectNodeCollection, "inspectNodeCollection");
	function inspectNode(node, options) {
		switch (node.nodeType) {
			case 1: return inspectHTML(node, options);
			case 3: return options.inspect(node.data, options);
			default: return options.inspect(node, options);
		}
	}
	__name(inspectNode, "inspectNode");
	function inspectHTML(element, options) {
		const properties = element.getAttributeNames();
		const name = element.tagName.toLowerCase();
		const head = options.stylize(`<${name}`, "special");
		const headClose = options.stylize(`>`, "special");
		const tail = options.stylize(`</${name}>`, "special");
		options.truncate -= name.length * 2 + 5;
		let propertyContents = "";
		if (properties.length > 0) {
			propertyContents += " ";
			propertyContents += inspectList(properties.map((key) => [key, element.getAttribute(key)]), options, inspectAttribute, " ");
		}
		options.truncate -= propertyContents.length;
		const truncate2 = options.truncate;
		let children = inspectNodeCollection(element.children, options);
		if (children && children.length > truncate2) children = `${truncator}(${element.children.length})`;
		return `${head}${propertyContents}${headClose}${children}${tail}`;
	}
	__name(inspectHTML, "inspectHTML");
	var chaiInspect = typeof Symbol === "function" && typeof Symbol.for === "function" ? /* @__PURE__ */ Symbol.for("chai/inspect") : "@@chai/inspect";
	var nodeInspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
	var constructorMap = /* @__PURE__ */ new WeakMap();
	var stringTagMap = {};
	var baseTypesMap = {
		undefined: /* @__PURE__ */ __name((value, options) => options.stylize("undefined", "undefined"), "undefined"),
		null: /* @__PURE__ */ __name((value, options) => options.stylize("null", "null"), "null"),
		boolean: /* @__PURE__ */ __name((value, options) => options.stylize(String(value), "boolean"), "boolean"),
		Boolean: /* @__PURE__ */ __name((value, options) => options.stylize(String(value), "boolean"), "Boolean"),
		number: inspectNumber,
		Number: inspectNumber,
		bigint: inspectBigInt,
		BigInt: inspectBigInt,
		string: inspectString,
		String: inspectString,
		function: inspectFunction,
		Function: inspectFunction,
		symbol: inspectSymbol,
		Symbol: inspectSymbol,
		Array: inspectArray,
		Date: inspectDate,
		Map: inspectMap,
		Set: inspectSet,
		RegExp: inspectRegExp,
		Promise: promise_default,
		WeakSet: /* @__PURE__ */ __name((value, options) => options.stylize("WeakSet{…}", "special"), "WeakSet"),
		WeakMap: /* @__PURE__ */ __name((value, options) => options.stylize("WeakMap{…}", "special"), "WeakMap"),
		Arguments: inspectArguments,
		Int8Array: inspectTypedArray,
		Uint8Array: inspectTypedArray,
		Uint8ClampedArray: inspectTypedArray,
		Int16Array: inspectTypedArray,
		Uint16Array: inspectTypedArray,
		Int32Array: inspectTypedArray,
		Uint32Array: inspectTypedArray,
		Float32Array: inspectTypedArray,
		Float64Array: inspectTypedArray,
		Generator: /* @__PURE__ */ __name(() => "", "Generator"),
		DataView: /* @__PURE__ */ __name(() => "", "DataView"),
		ArrayBuffer: /* @__PURE__ */ __name(() => "", "ArrayBuffer"),
		Error: inspectObject2,
		HTMLCollection: inspectNodeCollection,
		NodeList: inspectNodeCollection
	};
	var inspectCustom = /* @__PURE__ */ __name((value, options, type3, inspectFn) => {
		if (chaiInspect in value && typeof value[chaiInspect] === "function") return value[chaiInspect](options);
		if (nodeInspect in value && typeof value[nodeInspect] === "function") return value[nodeInspect](options.depth, options, inspectFn);
		if ("inspect" in value && typeof value.inspect === "function") return value.inspect(options.depth, options);
		if ("constructor" in value && constructorMap.has(value.constructor)) return constructorMap.get(value.constructor)(value, options);
		if (stringTagMap[type3]) return stringTagMap[type3](value, options);
		return "";
	}, "inspectCustom");
	var toString = Object.prototype.toString;
	function inspect(value, opts = {}) {
		const options = normaliseOptions(opts, inspect);
		const { customInspect } = options;
		let type3 = value === null ? "null" : typeof value;
		if (type3 === "object") type3 = toString.call(value).slice(8, -1);
		if (type3 in baseTypesMap) return baseTypesMap[type3](value, options);
		if (customInspect && value) {
			const output = inspectCustom(value, options, type3, inspect);
			if (output) {
				if (typeof output === "string") return output;
				return inspect(output, options);
			}
		}
		const proto = value ? Object.getPrototypeOf(value) : false;
		if (proto === Object.prototype || proto === null) return inspectObject(value, options);
		if (value && typeof HTMLElement === "function" && value instanceof HTMLElement) return inspectHTML(value, options);
		if ("constructor" in value) {
			if (value.constructor !== Object) return inspectClass(value, options);
			return inspectObject(value, options);
		}
		if (value === Object(value)) return inspectObject(value, options);
		return options.stylize(String(value), type3);
	}
	__name(inspect, "inspect");
	var config = {
		/**
		* ### config.includeStack
		*
		* User configurable property, influences whether stack trace
		* is included in Assertion error message. Default of false
		* suppresses stack trace in the error message.
		*
		*     chai.config.includeStack = true;  // enable stack on error
		*
		* @param {boolean}
		* @public
		*/
		includeStack: false,
		/**
		* ### config.showDiff
		*
		* User configurable property, influences whether or not
		* the `showDiff` flag should be included in the thrown
		* AssertionErrors. `false` will always be `false`; `true`
		* will be true when the assertion has requested a diff
		* be shown.
		*
		* @param {boolean}
		* @public
		*/
		showDiff: true,
		/**
		* ### config.truncateThreshold
		*
		* User configurable property, sets length threshold for actual and
		* expected values in assertion errors. If this threshold is exceeded, for
		* example for large data structures, the value is replaced with something
		* like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
		*
		* Set it to zero if you want to disable truncating altogether.
		*
		* This is especially userful when doing assertions on arrays: having this
		* set to a reasonable large value makes the failure messages readily
		* inspectable.
		*
		*     chai.config.truncateThreshold = 0;  // disable truncating
		*
		* @param {number}
		* @public
		*/
		truncateThreshold: 40,
		/**
		* ### config.useProxy
		*
		* User configurable property, defines if chai will use a Proxy to throw
		* an error when a non-existent property is read, which protects users
		* from typos when using property-based assertions.
		*
		* Set it to false if you want to disable this feature.
		*
		*     chai.config.useProxy = false;  // disable use of Proxy
		*
		* This feature is automatically disabled regardless of this config value
		* in environments that don't support proxies.
		*
		* @param {boolean}
		* @public
		*/
		useProxy: true,
		/**
		* ### config.proxyExcludedKeys
		*
		* User configurable property, defines which properties should be ignored
		* instead of throwing an error if they do not exist on the assertion.
		* This is only applied if the environment Chai is running in supports proxies and
		* if the `useProxy` configuration setting is enabled.
		* By default, `then` and `inspect` will not throw an error if they do not exist on the
		* assertion object because the `.inspect` property is read by `util.inspect` (for example, when
		* using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
		*
		*     // By default these keys will not throw an error if they do not exist on the assertion object
		*     chai.config.proxyExcludedKeys = ['then', 'inspect'];
		*
		* @param {Array}
		* @public
		*/
		proxyExcludedKeys: [
			"then",
			"catch",
			"inspect",
			"toJSON"
		],
		/**
		* ### config.deepEqual
		*
		* User configurable property, defines which a custom function to use for deepEqual
		* comparisons.
		* By default, the function used is the one from the `deep-eql` package without custom comparator.
		*
		*     // use a custom comparator
		*     chai.config.deepEqual = (expected, actual) => {
		*         return chai.util.eql(expected, actual, {
		*             comparator: (expected, actual) => {
		*                 // for non number comparison, use the default behavior
		*                 if(typeof expected !== 'number') return null;
		*                 // allow a difference of 10 between compared numbers
		*                 return typeof actual === 'number' && Math.abs(actual - expected) < 10
		*             }
		*         })
		*     };
		*
		* @param {Function}
		* @public
		*/
		deepEqual: null
	};
	function inspect2(obj, showHidden, depth, colors) {
		return inspect(obj, {
			colors,
			depth: typeof depth === "undefined" ? 2 : depth,
			showHidden,
			truncate: config.truncateThreshold ? config.truncateThreshold : Infinity
		});
	}
	__name(inspect2, "inspect");
	function objDisplay(obj) {
		let str = inspect2(obj), type3 = Object.prototype.toString.call(obj);
		if (config.truncateThreshold && str.length >= config.truncateThreshold) if (type3 === "[object Function]") return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
		else if (type3 === "[object Array]") return "[ Array(" + obj.length + ") ]";
		else if (type3 === "[object Object]") {
			let keys = Object.keys(obj);
			return "{ Object (" + (keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ")) + ") }";
		} else return str;
		else return str;
	}
	__name(objDisplay, "objDisplay");
	function getMessage2(obj, args) {
		let negate = flag(obj, "negate");
		let val = flag(obj, "object");
		let expected = args[3];
		let actual = getActual(obj, args);
		let msg = negate ? args[2] : args[1];
		let flagMsg = flag(obj, "message");
		if (typeof msg === "function") msg = msg();
		msg = msg || "";
		msg = msg.replace(/#\{this\}/g, function() {
			return objDisplay(val);
		}).replace(/#\{act\}/g, function() {
			return objDisplay(actual);
		}).replace(/#\{exp\}/g, function() {
			return objDisplay(expected);
		});
		return flagMsg ? flagMsg + ": " + msg : msg;
	}
	__name(getMessage2, "getMessage");
	function transferFlags(assertion, object, includeAll) {
		let flags = assertion.__flags || (assertion.__flags = /* @__PURE__ */ Object.create(null));
		if (!object.__flags) object.__flags = /* @__PURE__ */ Object.create(null);
		includeAll = arguments.length === 3 ? includeAll : true;
		for (let flag3 in flags) if (includeAll || flag3 !== "object" && flag3 !== "ssfi" && flag3 !== "lockSsfi" && flag3 != "message") object.__flags[flag3] = flags[flag3];
	}
	__name(transferFlags, "transferFlags");
	function type2(obj) {
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		const stringTag = obj[Symbol.toStringTag];
		if (typeof stringTag === "string") return stringTag;
		return Object.prototype.toString.call(obj).slice(8, -1);
	}
	__name(type2, "type");
	function FakeMap() {
		this._key = "chai/deep-eql__" + Math.random() + Date.now();
	}
	__name(FakeMap, "FakeMap");
	FakeMap.prototype = {
		get: /* @__PURE__ */ __name(function get(key) {
			return key[this._key];
		}, "get"),
		set: /* @__PURE__ */ __name(function set(key, value) {
			if (Object.isExtensible(key)) Object.defineProperty(key, this._key, {
				value,
				configurable: true
			});
		}, "set")
	};
	var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
	function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
		if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return null;
		var leftHandMap = memoizeMap.get(leftHandOperand);
		if (leftHandMap) {
			var result = leftHandMap.get(rightHandOperand);
			if (typeof result === "boolean") return result;
		}
		return null;
	}
	__name(memoizeCompare, "memoizeCompare");
	function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
		if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return;
		var leftHandMap = memoizeMap.get(leftHandOperand);
		if (leftHandMap) leftHandMap.set(rightHandOperand, result);
		else {
			leftHandMap = new MemoizeMap();
			leftHandMap.set(rightHandOperand, result);
			memoizeMap.set(leftHandOperand, leftHandMap);
		}
	}
	__name(memoizeSet, "memoizeSet");
	var deep_eql_default = deepEqual;
	function deepEqual(leftHandOperand, rightHandOperand, options) {
		if (options && options.comparator) return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
		var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
		if (simpleResult !== null) return simpleResult;
		return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	}
	__name(deepEqual, "deepEqual");
	function simpleEqual(leftHandOperand, rightHandOperand) {
		if (leftHandOperand === rightHandOperand) return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
		if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) return true;
		if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) return false;
		return null;
	}
	__name(simpleEqual, "simpleEqual");
	function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
		options = options || {};
		options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
		var comparator = options && options.comparator;
		var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
		if (memoizeResultLeft !== null) return memoizeResultLeft;
		var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
		if (memoizeResultRight !== null) return memoizeResultRight;
		if (comparator) {
			var comparatorResult = comparator(leftHandOperand, rightHandOperand);
			if (comparatorResult === false || comparatorResult === true) {
				memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
				return comparatorResult;
			}
			var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
			if (simpleResult !== null) return simpleResult;
		}
		var leftHandType = type2(leftHandOperand);
		if (leftHandType !== type2(rightHandOperand)) {
			memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
			return false;
		}
		memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
		var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
		memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
		return result;
	}
	__name(extensiveDeepEqual, "extensiveDeepEqual");
	function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
		switch (leftHandType) {
			case "String":
			case "Number":
			case "Boolean":
			case "Date": return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
			case "Promise":
			case "Symbol":
			case "function":
			case "WeakMap":
			case "WeakSet": return leftHandOperand === rightHandOperand;
			case "Error": return keysEqual(leftHandOperand, rightHandOperand, [
				"name",
				"message",
				"code"
			], options);
			case "Arguments":
			case "Int8Array":
			case "Uint8Array":
			case "Uint8ClampedArray":
			case "Int16Array":
			case "Uint16Array":
			case "Int32Array":
			case "Uint32Array":
			case "Float32Array":
			case "Float64Array":
			case "Array": return iterableEqual(leftHandOperand, rightHandOperand, options);
			case "RegExp": return regexpEqual(leftHandOperand, rightHandOperand);
			case "Generator": return generatorEqual(leftHandOperand, rightHandOperand, options);
			case "DataView": return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
			case "ArrayBuffer": return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
			case "Set": return entriesEqual(leftHandOperand, rightHandOperand, options);
			case "Map": return entriesEqual(leftHandOperand, rightHandOperand, options);
			case "Temporal.PlainDate":
			case "Temporal.PlainTime":
			case "Temporal.PlainDateTime":
			case "Temporal.Instant":
			case "Temporal.ZonedDateTime":
			case "Temporal.PlainYearMonth":
			case "Temporal.PlainMonthDay": return leftHandOperand.equals(rightHandOperand);
			case "Temporal.Duration": return leftHandOperand.total("nanoseconds") === rightHandOperand.total("nanoseconds");
			case "Temporal.TimeZone":
			case "Temporal.Calendar": return leftHandOperand.toString() === rightHandOperand.toString();
			default: return objectEqual(leftHandOperand, rightHandOperand, options);
		}
	}
	__name(extensiveDeepEqualByType, "extensiveDeepEqualByType");
	function regexpEqual(leftHandOperand, rightHandOperand) {
		return leftHandOperand.toString() === rightHandOperand.toString();
	}
	__name(regexpEqual, "regexpEqual");
	function entriesEqual(leftHandOperand, rightHandOperand, options) {
		try {
			if (leftHandOperand.size !== rightHandOperand.size) return false;
			if (leftHandOperand.size === 0) return true;
		} catch (sizeError) {
			return false;
		}
		var leftHandItems = [];
		var rightHandItems = [];
		leftHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
			leftHandItems.push([key, value]);
		}, "gatherEntries"));
		rightHandOperand.forEach(/* @__PURE__ */ __name(function gatherEntries(key, value) {
			rightHandItems.push([key, value]);
		}, "gatherEntries"));
		return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
	}
	__name(entriesEqual, "entriesEqual");
	function iterableEqual(leftHandOperand, rightHandOperand, options) {
		var length = leftHandOperand.length;
		if (length !== rightHandOperand.length) return false;
		if (length === 0) return true;
		var index = -1;
		while (++index < length) if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) return false;
		return true;
	}
	__name(iterableEqual, "iterableEqual");
	function generatorEqual(leftHandOperand, rightHandOperand, options) {
		return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
	}
	__name(generatorEqual, "generatorEqual");
	function hasIteratorFunction(target) {
		return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
	}
	__name(hasIteratorFunction, "hasIteratorFunction");
	function getIteratorEntries(target) {
		if (hasIteratorFunction(target)) try {
			return getGeneratorEntries(target[Symbol.iterator]());
		} catch (iteratorError) {
			return [];
		}
		return [];
	}
	__name(getIteratorEntries, "getIteratorEntries");
	function getGeneratorEntries(generator) {
		var generatorResult = generator.next();
		var accumulator = [generatorResult.value];
		while (generatorResult.done === false) {
			generatorResult = generator.next();
			accumulator.push(generatorResult.value);
		}
		return accumulator;
	}
	__name(getGeneratorEntries, "getGeneratorEntries");
	function getEnumerableKeys(target) {
		var keys = [];
		for (var key in target) keys.push(key);
		return keys;
	}
	__name(getEnumerableKeys, "getEnumerableKeys");
	function getEnumerableSymbols(target) {
		var keys = [];
		var allKeys = Object.getOwnPropertySymbols(target);
		for (var i = 0; i < allKeys.length; i += 1) {
			var key = allKeys[i];
			if (Object.getOwnPropertyDescriptor(target, key).enumerable) keys.push(key);
		}
		return keys;
	}
	__name(getEnumerableSymbols, "getEnumerableSymbols");
	function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
		var length = keys.length;
		if (length === 0) return true;
		for (var i = 0; i < length; i += 1) if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) return false;
		return true;
	}
	__name(keysEqual, "keysEqual");
	function objectEqual(leftHandOperand, rightHandOperand, options) {
		var leftHandKeys = getEnumerableKeys(leftHandOperand);
		var rightHandKeys = getEnumerableKeys(rightHandOperand);
		var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
		var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
		leftHandKeys = leftHandKeys.concat(leftHandSymbols);
		rightHandKeys = rightHandKeys.concat(rightHandSymbols);
		if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
			if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) return false;
			return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
		}
		var leftHandEntries = getIteratorEntries(leftHandOperand);
		var rightHandEntries = getIteratorEntries(rightHandOperand);
		if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
			leftHandEntries.sort();
			rightHandEntries.sort();
			return iterableEqual(leftHandEntries, rightHandEntries, options);
		}
		if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) return true;
		return false;
	}
	__name(objectEqual, "objectEqual");
	function isPrimitive(value) {
		return value === null || typeof value !== "object";
	}
	__name(isPrimitive, "isPrimitive");
	function mapSymbols(arr) {
		return arr.map(/* @__PURE__ */ __name(function mapSymbol(entry) {
			if (typeof entry === "symbol") return entry.toString();
			return entry;
		}, "mapSymbol"));
	}
	__name(mapSymbols, "mapSymbols");
	function hasProperty(obj, name) {
		if (typeof obj === "undefined" || obj === null) return false;
		return name in Object(obj);
	}
	__name(hasProperty, "hasProperty");
	function parsePath(path) {
		return path.replace(/([^\\])\[/g, "$1.[").match(/(\\\.|[^.]+?)+/g).map((value) => {
			if (value === "constructor" || value === "__proto__" || value === "prototype") return {};
			const mArr = /^\[(\d+)\]$/.exec(value);
			let parsed = null;
			if (mArr) parsed = { i: parseFloat(mArr[1]) };
			else parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
			return parsed;
		});
	}
	__name(parsePath, "parsePath");
	function internalGetPathValue(obj, parsed, pathDepth) {
		let temporaryValue = obj;
		let res = null;
		pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
		for (let i = 0; i < pathDepth; i++) {
			const part = parsed[i];
			if (temporaryValue) {
				if (typeof part.p === "undefined") temporaryValue = temporaryValue[part.i];
				else temporaryValue = temporaryValue[part.p];
				if (i === pathDepth - 1) res = temporaryValue;
			}
		}
		return res;
	}
	__name(internalGetPathValue, "internalGetPathValue");
	function getPathInfo(obj, path) {
		const parsed = parsePath(path);
		const last = parsed[parsed.length - 1];
		const info = {
			parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
			name: last.p || last.i,
			value: internalGetPathValue(obj, parsed)
		};
		info.exists = hasProperty(info.parent, info.name);
		return info;
	}
	__name(getPathInfo, "getPathInfo");
	var _Assertion = class _Assertion {
		/**
		* Creates object for chaining.
		* `Assertion` objects contain metadata in the form of flags. Three flags can
		* be assigned during instantiation by passing arguments to this constructor:
		*
		* - `object`: This flag contains the target of the assertion. For example, in
		* the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
		* contain `numKittens` so that the `equal` assertion can reference it when
		* needed.
		*
		* - `message`: This flag contains an optional custom error message to be
		* prepended to the error message that's generated by the assertion when it
		* fails.
		*
		* - `ssfi`: This flag stands for "start stack function indicator". It
		* contains a function reference that serves as the starting point for
		* removing frames from the stack trace of the error that's created by the
		* assertion when it fails. The goal is to provide a cleaner stack trace to
		* end users by removing Chai's internal functions. Note that it only works
		* in environments that support `Error.captureStackTrace`, and only when
		* `Chai.config.includeStack` hasn't been set to `false`.
		*
		* - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
		* should retain its current value, even as assertions are chained off of
		* this object. This is usually set to `true` when creating a new assertion
		* from within another assertion. It's also temporarily set to `true` before
		* an overwritten assertion gets called by the overwriting assertion.
		*
		* - `eql`: This flag contains the deepEqual function to be used by the assertion.
		*
		* @param {unknown} obj target of the assertion
		* @param {string} [msg] (optional) custom error message
		* @param {Function} [ssfi] (optional) starting point for removing stack frames
		* @param {boolean} [lockSsfi] (optional) whether or not the ssfi flag is locked
		*/
		constructor(obj, msg, ssfi, lockSsfi) {
			/** @type {{}} */
			__publicField(this, "__flags", {});
			flag(this, "ssfi", ssfi || _Assertion);
			flag(this, "lockSsfi", lockSsfi);
			flag(this, "object", obj);
			flag(this, "message", msg);
			flag(this, "eql", config.deepEqual || deep_eql_default);
			return proxify(this);
		}
		/** @returns {boolean} */
		static get includeStack() {
			console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
			return config.includeStack;
		}
		/** @param {boolean} value */
		static set includeStack(value) {
			console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
			config.includeStack = value;
		}
		/** @returns {boolean} */
		static get showDiff() {
			console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
			return config.showDiff;
		}
		/** @param {boolean} value */
		static set showDiff(value) {
			console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
			config.showDiff = value;
		}
		/**
		* @param {string} name
		* @param {Function} fn
		*/
		static addProperty(name, fn) {
			addProperty(this.prototype, name, fn);
		}
		/**
		* @param {string} name
		* @param {Function} fn
		*/
		static addMethod(name, fn) {
			addMethod(this.prototype, name, fn);
		}
		/**
		* @param {string} name
		* @param {Function} fn
		* @param {Function} chainingBehavior
		*/
		static addChainableMethod(name, fn, chainingBehavior) {
			addChainableMethod(this.prototype, name, fn, chainingBehavior);
		}
		/**
		* @param {string} name
		* @param {Function} fn
		*/
		static overwriteProperty(name, fn) {
			overwriteProperty(this.prototype, name, fn);
		}
		/**
		* @param {string} name
		* @param {Function} fn
		*/
		static overwriteMethod(name, fn) {
			overwriteMethod(this.prototype, name, fn);
		}
		/**
		* @param {string} name
		* @param {Function} fn
		* @param {Function} chainingBehavior
		*/
		static overwriteChainableMethod(name, fn, chainingBehavior) {
			overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
		}
		/**
		* ### .assert(expression, message, negateMessage, expected, actual, showDiff)
		*
		* Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
		*
		* @name assert
		* @param {unknown} _expr to be tested
		* @param {string | Function} msg or function that returns message to display if expression fails
		* @param {string | Function} _negateMsg or function that returns negatedMessage to display if negated expression fails
		* @param {unknown} expected value (remember to check for negation)
		* @param {unknown} _actual (optional) will default to `this.obj`
		* @param {boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
		* @returns {void}
		*/
		assert(_expr, msg, _negateMsg, expected, _actual, showDiff) {
			const ok = test(this, arguments);
			if (false !== showDiff) showDiff = true;
			if (void 0 === expected && void 0 === _actual) showDiff = false;
			if (true !== config.showDiff) showDiff = false;
			if (!ok) {
				msg = getMessage2(this, arguments);
				const assertionErrorObjectProperties = {
					actual: getActual(this, arguments),
					expected,
					showDiff
				};
				const operator = getOperator(this, arguments);
				if (operator) assertionErrorObjectProperties.operator = operator;
				throw new AssertionError(msg, assertionErrorObjectProperties, config.includeStack ? this.assert : flag(this, "ssfi"));
			}
		}
		/**
		* Quick reference to stored `actual` value for plugin developers.
		*
		* @returns {unknown}
		*/
		get _obj() {
			return flag(this, "object");
		}
		/**
		* Quick reference to stored `actual` value for plugin developers.
		*
		* @param {unknown} val
		*/
		set _obj(val) {
			flag(this, "object", val);
		}
	};
	__name(_Assertion, "Assertion");
	var Assertion = _Assertion;
	var events = new EventTarget();
	var _PluginEvent = class _PluginEvent extends Event {
		constructor(type3, name, fn) {
			super(type3);
			this.name = String(name);
			this.fn = fn;
		}
	};
	__name(_PluginEvent, "PluginEvent");
	var PluginEvent = _PluginEvent;
	function isProxyEnabled() {
		return config.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
	}
	__name(isProxyEnabled, "isProxyEnabled");
	function addProperty(ctx, name, getter) {
		getter = getter === void 0 ? function() {} : getter;
		Object.defineProperty(ctx, name, {
			get: /* @__PURE__ */ __name(function propertyGetter() {
				if (!isProxyEnabled() && !flag(this, "lockSsfi")) flag(this, "ssfi", propertyGetter);
				let result = getter.call(this);
				if (result !== void 0) return result;
				let newAssertion = new Assertion();
				transferFlags(this, newAssertion);
				return newAssertion;
			}, "propertyGetter"),
			configurable: true
		});
		events.dispatchEvent(new PluginEvent("addProperty", name, getter));
	}
	__name(addProperty, "addProperty");
	var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {}, "length");
	function addLengthGuard(fn, assertionName, isChainable) {
		if (!fnLengthDesc.configurable) return fn;
		Object.defineProperty(fn, "length", { get: /* @__PURE__ */ __name(function() {
			if (isChainable) throw Error("Invalid Chai property: " + assertionName + ".length. Due to a compatibility issue, \"length\" cannot directly follow \"" + assertionName + "\". Use \"" + assertionName + ".lengthOf\" instead.");
			throw Error("Invalid Chai property: " + assertionName + ".length. See docs for proper usage of \"" + assertionName + "\".");
		}, "get") });
		return fn;
	}
	__name(addLengthGuard, "addLengthGuard");
	function getProperties(object) {
		let result = Object.getOwnPropertyNames(object);
		function addProperty2(property) {
			if (result.indexOf(property) === -1) result.push(property);
		}
		__name(addProperty2, "addProperty");
		let proto = Object.getPrototypeOf(object);
		while (proto !== null) {
			Object.getOwnPropertyNames(proto).forEach(addProperty2);
			proto = Object.getPrototypeOf(proto);
		}
		return result;
	}
	__name(getProperties, "getProperties");
	var builtins = [
		"__flags",
		"__methods",
		"_obj",
		"assert"
	];
	function proxify(obj, nonChainableMethodName) {
		if (!isProxyEnabled()) return obj;
		return new Proxy(obj, { get: /* @__PURE__ */ __name(function proxyGetter(target, property) {
			if (typeof property === "string" && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
				if (nonChainableMethodName) throw Error("Invalid Chai property: " + nonChainableMethodName + "." + property + ". See docs for proper usage of \"" + nonChainableMethodName + "\".");
				let suggestion = null;
				let suggestionDistance = 4;
				getProperties(target).forEach(function(prop) {
					if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
						let dist = stringDistanceCapped(property, prop, suggestionDistance);
						if (dist < suggestionDistance) {
							suggestion = prop;
							suggestionDistance = dist;
						}
					}
				});
				if (suggestion !== null) throw Error("Invalid Chai property: " + property + ". Did you mean \"" + suggestion + "\"?");
				else throw Error("Invalid Chai property: " + property);
			}
			if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) flag(target, "ssfi", proxyGetter);
			return Reflect.get(target, property);
		}, "proxyGetter") });
	}
	__name(proxify, "proxify");
	function stringDistanceCapped(strA, strB, cap) {
		if (Math.abs(strA.length - strB.length) >= cap) return cap;
		let memo = [];
		for (let i = 0; i <= strA.length; i++) {
			memo[i] = Array(strB.length + 1).fill(0);
			memo[i][0] = i;
		}
		for (let j = 0; j < strB.length; j++) memo[0][j] = j;
		for (let i = 1; i <= strA.length; i++) {
			let ch = strA.charCodeAt(i - 1);
			for (let j = 1; j <= strB.length; j++) {
				if (Math.abs(i - j) >= cap) {
					memo[i][j] = cap;
					continue;
				}
				memo[i][j] = Math.min(memo[i - 1][j] + 1, memo[i][j - 1] + 1, memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1));
			}
		}
		return memo[strA.length][strB.length];
	}
	__name(stringDistanceCapped, "stringDistanceCapped");
	function addMethod(ctx, name, method) {
		let methodWrapper = /* @__PURE__ */ __name(function() {
			if (!flag(this, "lockSsfi")) flag(this, "ssfi", methodWrapper);
			let result = method.apply(this, arguments);
			if (result !== void 0) return result;
			let newAssertion = new Assertion();
			transferFlags(this, newAssertion);
			return newAssertion;
		}, "methodWrapper");
		addLengthGuard(methodWrapper, name, false);
		ctx[name] = proxify(methodWrapper, name);
		events.dispatchEvent(new PluginEvent("addMethod", name, method));
	}
	__name(addMethod, "addMethod");
	function overwriteProperty(ctx, name, getter) {
		let _get = Object.getOwnPropertyDescriptor(ctx, name), _super = /* @__PURE__ */ __name(function() {}, "_super");
		if (_get && "function" === typeof _get.get) _super = _get.get;
		Object.defineProperty(ctx, name, {
			get: /* @__PURE__ */ __name(function overwritingPropertyGetter() {
				if (!isProxyEnabled() && !flag(this, "lockSsfi")) flag(this, "ssfi", overwritingPropertyGetter);
				let origLockSsfi = flag(this, "lockSsfi");
				flag(this, "lockSsfi", true);
				let result = getter(_super).call(this);
				flag(this, "lockSsfi", origLockSsfi);
				if (result !== void 0) return result;
				let newAssertion = new Assertion();
				transferFlags(this, newAssertion);
				return newAssertion;
			}, "overwritingPropertyGetter"),
			configurable: true
		});
	}
	__name(overwriteProperty, "overwriteProperty");
	function overwriteMethod(ctx, name, method) {
		let _method = ctx[name], _super = /* @__PURE__ */ __name(function() {
			throw new Error(name + " is not a function");
		}, "_super");
		if (_method && "function" === typeof _method) _super = _method;
		let overwritingMethodWrapper = /* @__PURE__ */ __name(function() {
			if (!flag(this, "lockSsfi")) flag(this, "ssfi", overwritingMethodWrapper);
			let origLockSsfi = flag(this, "lockSsfi");
			flag(this, "lockSsfi", true);
			let result = method(_super).apply(this, arguments);
			flag(this, "lockSsfi", origLockSsfi);
			if (result !== void 0) return result;
			let newAssertion = new Assertion();
			transferFlags(this, newAssertion);
			return newAssertion;
		}, "overwritingMethodWrapper");
		addLengthGuard(overwritingMethodWrapper, name, false);
		ctx[name] = proxify(overwritingMethodWrapper, name);
	}
	__name(overwriteMethod, "overwriteMethod");
	var canSetPrototype = typeof Object.setPrototypeOf === "function";
	var testFn = /* @__PURE__ */ __name(function() {}, "testFn");
	var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
		let propDesc = Object.getOwnPropertyDescriptor(testFn, name);
		if (typeof propDesc !== "object") return true;
		return !propDesc.configurable;
	});
	var call = Function.prototype.call;
	var apply = Function.prototype.apply;
	var _PluginAddChainableMethodEvent = class _PluginAddChainableMethodEvent extends PluginEvent {
		constructor(type3, name, fn, chainingBehavior) {
			super(type3, name, fn);
			this.chainingBehavior = chainingBehavior;
		}
	};
	__name(_PluginAddChainableMethodEvent, "PluginAddChainableMethodEvent");
	var PluginAddChainableMethodEvent = _PluginAddChainableMethodEvent;
	function addChainableMethod(ctx, name, method, chainingBehavior) {
		if (typeof chainingBehavior !== "function") chainingBehavior = /* @__PURE__ */ __name(function() {}, "chainingBehavior");
		let chainableBehavior = {
			method,
			chainingBehavior
		};
		if (!ctx.__methods) ctx.__methods = {};
		ctx.__methods[name] = chainableBehavior;
		Object.defineProperty(ctx, name, {
			get: /* @__PURE__ */ __name(function chainableMethodGetter() {
				chainableBehavior.chainingBehavior.call(this);
				let chainableMethodWrapper = /* @__PURE__ */ __name(function() {
					if (!flag(this, "lockSsfi")) flag(this, "ssfi", chainableMethodWrapper);
					let result = chainableBehavior.method.apply(this, arguments);
					if (result !== void 0) return result;
					let newAssertion = new Assertion();
					transferFlags(this, newAssertion);
					return newAssertion;
				}, "chainableMethodWrapper");
				addLengthGuard(chainableMethodWrapper, name, true);
				if (canSetPrototype) {
					let prototype = Object.create(this);
					prototype.call = call;
					prototype.apply = apply;
					Object.setPrototypeOf(chainableMethodWrapper, prototype);
				} else Object.getOwnPropertyNames(ctx).forEach(function(asserterName) {
					if (excludeNames.indexOf(asserterName) !== -1) return;
					Object.defineProperty(chainableMethodWrapper, asserterName, Object.getOwnPropertyDescriptor(ctx, asserterName));
				});
				transferFlags(this, chainableMethodWrapper);
				return proxify(chainableMethodWrapper);
			}, "chainableMethodGetter"),
			configurable: true
		});
		events.dispatchEvent(new PluginAddChainableMethodEvent("addChainableMethod", name, method, chainingBehavior));
	}
	__name(addChainableMethod, "addChainableMethod");
	function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
		let chainableBehavior = ctx.__methods[name];
		let _chainingBehavior = chainableBehavior.chainingBehavior;
		chainableBehavior.chainingBehavior = /* @__PURE__ */ __name(function overwritingChainableMethodGetter() {
			let result = chainingBehavior(_chainingBehavior).call(this);
			if (result !== void 0) return result;
			let newAssertion = new Assertion();
			transferFlags(this, newAssertion);
			return newAssertion;
		}, "overwritingChainableMethodGetter");
		let _method = chainableBehavior.method;
		chainableBehavior.method = /* @__PURE__ */ __name(function overwritingChainableMethodWrapper() {
			let result = method(_method).apply(this, arguments);
			if (result !== void 0) return result;
			let newAssertion = new Assertion();
			transferFlags(this, newAssertion);
			return newAssertion;
		}, "overwritingChainableMethodWrapper");
	}
	__name(overwriteChainableMethod, "overwriteChainableMethod");
	function compareByInspect(a, b) {
		return inspect2(a) < inspect2(b) ? -1 : 1;
	}
	__name(compareByInspect, "compareByInspect");
	function getOwnEnumerablePropertySymbols(obj) {
		if (typeof Object.getOwnPropertySymbols !== "function") return [];
		return Object.getOwnPropertySymbols(obj).filter(function(sym) {
			return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
		});
	}
	__name(getOwnEnumerablePropertySymbols, "getOwnEnumerablePropertySymbols");
	function getOwnEnumerableProperties(obj) {
		return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
	}
	__name(getOwnEnumerableProperties, "getOwnEnumerableProperties");
	var isNaN2 = Number.isNaN;
	function isObjectType(obj) {
		let objectType = type(obj);
		return [
			"Array",
			"Object",
			"Function"
		].indexOf(objectType) !== -1;
	}
	__name(isObjectType, "isObjectType");
	function getOperator(obj, args) {
		let operator = flag(obj, "operator");
		let negate = flag(obj, "negate");
		let expected = args[3];
		let msg = negate ? args[2] : args[1];
		if (operator) return operator;
		if (typeof msg === "function") msg = msg();
		msg = msg || "";
		if (!msg) return;
		if (/\shave\s/.test(msg)) return;
		let isObject = isObjectType(expected);
		if (/\snot\s/.test(msg)) return isObject ? "notDeepStrictEqual" : "notStrictEqual";
		return isObject ? "deepStrictEqual" : "strictEqual";
	}
	__name(getOperator, "getOperator");
	function getName(fn) {
		return fn.name;
	}
	__name(getName, "getName");
	function isRegExp2(obj) {
		return Object.prototype.toString.call(obj) === "[object RegExp]";
	}
	__name(isRegExp2, "isRegExp");
	function isNumeric(obj) {
		return ["Number", "BigInt"].includes(type(obj));
	}
	__name(isNumeric, "isNumeric");
	var { flag: flag2 } = utils_exports;
	[
		"to",
		"be",
		"been",
		"is",
		"and",
		"has",
		"have",
		"with",
		"that",
		"which",
		"at",
		"of",
		"same",
		"but",
		"does",
		"still",
		"also"
	].forEach(function(chain) {
		Assertion.addProperty(chain);
	});
	Assertion.addProperty("not", function() {
		flag2(this, "negate", true);
	});
	Assertion.addProperty("deep", function() {
		flag2(this, "deep", true);
	});
	Assertion.addProperty("nested", function() {
		flag2(this, "nested", true);
	});
	Assertion.addProperty("own", function() {
		flag2(this, "own", true);
	});
	Assertion.addProperty("ordered", function() {
		flag2(this, "ordered", true);
	});
	Assertion.addProperty("any", function() {
		flag2(this, "any", true);
		flag2(this, "all", false);
	});
	Assertion.addProperty("all", function() {
		flag2(this, "all", true);
		flag2(this, "any", false);
	});
	var functionTypes = {
		function: [
			"function",
			"asyncfunction",
			"generatorfunction",
			"asyncgeneratorfunction"
		],
		asyncfunction: ["asyncfunction", "asyncgeneratorfunction"],
		generatorfunction: ["generatorfunction", "asyncgeneratorfunction"],
		asyncgeneratorfunction: ["asyncgeneratorfunction"]
	};
	function an(type3, msg) {
		if (msg) flag2(this, "message", msg);
		type3 = type3.toLowerCase();
		let obj = flag2(this, "object"), article = ~[
			"a",
			"e",
			"i",
			"o",
			"u"
		].indexOf(type3.charAt(0)) ? "an " : "a ";
		const detectedType = type(obj).toLowerCase();
		if (functionTypes["function"].includes(type3)) this.assert(functionTypes[type3].includes(detectedType), "expected #{this} to be " + article + type3, "expected #{this} not to be " + article + type3);
		else this.assert(type3 === detectedType, "expected #{this} to be " + article + type3, "expected #{this} not to be " + article + type3);
	}
	__name(an, "an");
	Assertion.addChainableMethod("an", an);
	Assertion.addChainableMethod("a", an);
	function SameValueZero(a, b) {
		return isNaN2(a) && isNaN2(b) || a === b;
	}
	__name(SameValueZero, "SameValueZero");
	function includeChainingBehavior() {
		flag2(this, "contains", true);
	}
	__name(includeChainingBehavior, "includeChainingBehavior");
	function include(val, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), negate = flag2(this, "negate"), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), descriptor = isDeep ? "deep " : "", isEql = isDeep ? flag2(this, "eql") : SameValueZero;
		flagMsg = flagMsg ? flagMsg + ": " : "";
		let included = false;
		switch (objType) {
			case "string":
				included = obj.indexOf(val) !== -1;
				break;
			case "weakset":
				if (isDeep) throw new AssertionError(flagMsg + "unable to use .deep.include with WeakSet", void 0, ssfi);
				included = obj.has(val);
				break;
			case "map":
				obj.forEach(function(item) {
					included = included || isEql(item, val);
				});
				break;
			case "set":
				if (isDeep) obj.forEach(function(item) {
					included = included || isEql(item, val);
				});
				else included = obj.has(val);
				break;
			case "array":
				if (isDeep) included = obj.some(function(item) {
					return isEql(item, val);
				});
				else included = obj.indexOf(val) !== -1;
				break;
			default: {
				if (val !== Object(val)) throw new AssertionError(flagMsg + "the given combination of arguments (" + objType + " and " + type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + type(val).toLowerCase(), void 0, ssfi);
				let props = Object.keys(val);
				let firstErr = null;
				let numErrs = 0;
				props.forEach(function(prop) {
					let propAssertion = new Assertion(obj);
					transferFlags(this, propAssertion, true);
					flag2(propAssertion, "lockSsfi", true);
					if (!negate || props.length === 1) {
						propAssertion.property(prop, val[prop]);
						return;
					}
					try {
						propAssertion.property(prop, val[prop]);
					} catch (err) {
						if (!check_error_exports.compatibleConstructor(err, AssertionError)) throw err;
						if (firstErr === null) firstErr = err;
						numErrs++;
					}
				}, this);
				if (negate && props.length > 1 && numErrs === props.length) throw firstErr;
				return;
			}
		}
		this.assert(included, "expected #{this} to " + descriptor + "include " + inspect2(val), "expected #{this} to not " + descriptor + "include " + inspect2(val));
	}
	__name(include, "include");
	Assertion.addChainableMethod("include", include, includeChainingBehavior);
	Assertion.addChainableMethod("contain", include, includeChainingBehavior);
	Assertion.addChainableMethod("contains", include, includeChainingBehavior);
	Assertion.addChainableMethod("includes", include, includeChainingBehavior);
	Assertion.addProperty("ok", function() {
		this.assert(flag2(this, "object"), "expected #{this} to be truthy", "expected #{this} to be falsy");
	});
	Assertion.addProperty("true", function() {
		this.assert(true === flag2(this, "object"), "expected #{this} to be true", "expected #{this} to be false", flag2(this, "negate") ? false : true);
	});
	Assertion.addProperty("numeric", function() {
		const object = flag2(this, "object");
		this.assert(["Number", "BigInt"].includes(type(object)), "expected #{this} to be numeric", "expected #{this} to not be numeric", flag2(this, "negate") ? false : true);
	});
	Assertion.addProperty("callable", function() {
		const val = flag2(this, "object");
		const ssfi = flag2(this, "ssfi");
		const message = flag2(this, "message");
		const msg = message ? `${message}: ` : "";
		const negate = flag2(this, "negate");
		const assertionMessage = negate ? `${msg}expected ${inspect2(val)} not to be a callable function` : `${msg}expected ${inspect2(val)} to be a callable function`;
		const isCallable = [
			"Function",
			"AsyncFunction",
			"GeneratorFunction",
			"AsyncGeneratorFunction"
		].includes(type(val));
		if (isCallable && negate || !isCallable && !negate) throw new AssertionError(assertionMessage, void 0, ssfi);
	});
	Assertion.addProperty("false", function() {
		this.assert(false === flag2(this, "object"), "expected #{this} to be false", "expected #{this} to be true", flag2(this, "negate") ? true : false);
	});
	Assertion.addProperty("null", function() {
		this.assert(null === flag2(this, "object"), "expected #{this} to be null", "expected #{this} not to be null");
	});
	Assertion.addProperty("undefined", function() {
		this.assert(void 0 === flag2(this, "object"), "expected #{this} to be undefined", "expected #{this} not to be undefined");
	});
	Assertion.addProperty("NaN", function() {
		this.assert(isNaN2(flag2(this, "object")), "expected #{this} to be NaN", "expected #{this} not to be NaN");
	});
	function assertExist() {
		let val = flag2(this, "object");
		this.assert(val !== null && val !== void 0, "expected #{this} to exist", "expected #{this} to not exist");
	}
	__name(assertExist, "assertExist");
	Assertion.addProperty("exist", assertExist);
	Assertion.addProperty("exists", assertExist);
	Assertion.addProperty("empty", function() {
		let val = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), itemsCount;
		flagMsg = flagMsg ? flagMsg + ": " : "";
		switch (type(val).toLowerCase()) {
			case "array":
			case "string":
				itemsCount = val.length;
				break;
			case "map":
			case "set":
				itemsCount = val.size;
				break;
			case "weakmap":
			case "weakset": throw new AssertionError(flagMsg + ".empty was passed a weak collection", void 0, ssfi);
			case "function": throw new AssertionError((flagMsg + ".empty was passed a function " + getName(val)).trim(), void 0, ssfi);
			default:
				if (val !== Object(val)) throw new AssertionError(flagMsg + ".empty was passed non-string primitive " + inspect2(val), void 0, ssfi);
				itemsCount = Object.keys(val).length;
		}
		this.assert(0 === itemsCount, "expected #{this} to be empty", "expected #{this} not to be empty");
	});
	function checkArguments() {
		let type3 = type(flag2(this, "object"));
		this.assert("Arguments" === type3, "expected #{this} to be arguments but got " + type3, "expected #{this} to not be arguments");
	}
	__name(checkArguments, "checkArguments");
	Assertion.addProperty("arguments", checkArguments);
	Assertion.addProperty("Arguments", checkArguments);
	function assertEqual(val, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object");
		if (flag2(this, "deep")) {
			let prevLockSsfi = flag2(this, "lockSsfi");
			flag2(this, "lockSsfi", true);
			this.eql(val);
			flag2(this, "lockSsfi", prevLockSsfi);
		} else this.assert(val === obj, "expected #{this} to equal #{exp}", "expected #{this} to not equal #{exp}", val, this._obj, true);
	}
	__name(assertEqual, "assertEqual");
	Assertion.addMethod("equal", assertEqual);
	Assertion.addMethod("equals", assertEqual);
	Assertion.addMethod("eq", assertEqual);
	function assertEql(obj, msg) {
		if (msg) flag2(this, "message", msg);
		let eql = flag2(this, "eql");
		this.assert(eql(obj, flag2(this, "object")), "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", obj, this._obj, true);
	}
	__name(assertEql, "assertEql");
	Assertion.addMethod("eql", assertEql);
	Assertion.addMethod("eqls", assertEql);
	function assertAbove(n, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase();
		if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
		if (!doLength && objType === "date" && nType !== "date") throw new AssertionError(msgPrefix + "the argument to above must be a date", void 0, ssfi);
		else if (!isNumeric(n) && (doLength || isNumeric(obj))) throw new AssertionError(msgPrefix + "the argument to above must be a number", void 0, ssfi);
		else if (!doLength && objType !== "date" && !isNumeric(obj)) {
			let printObj = objType === "string" ? "'" + obj + "'" : obj;
			throw new AssertionError(msgPrefix + "expected " + printObj + " to be a number or a date", void 0, ssfi);
		}
		if (doLength) {
			let descriptor = "length", itemsCount;
			if (objType === "map" || objType === "set") {
				descriptor = "size";
				itemsCount = obj.size;
			} else itemsCount = obj.length;
			this.assert(itemsCount > n, "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " above #{exp}", n, itemsCount);
		} else this.assert(obj > n, "expected #{this} to be above #{exp}", "expected #{this} to be at most #{exp}", n);
	}
	__name(assertAbove, "assertAbove");
	Assertion.addMethod("above", assertAbove);
	Assertion.addMethod("gt", assertAbove);
	Assertion.addMethod("greaterThan", assertAbove);
	function assertLeast(n, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
		if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
		if (!doLength && objType === "date" && nType !== "date") errorMessage = msgPrefix + "the argument to least must be a date";
		else if (!isNumeric(n) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the argument to least must be a number";
		else if (!doLength && objType !== "date" && !isNumeric(obj)) {
			let printObj = objType === "string" ? "'" + obj + "'" : obj;
			errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
		} else shouldThrow = false;
		if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
		if (doLength) {
			let descriptor = "length", itemsCount;
			if (objType === "map" || objType === "set") {
				descriptor = "size";
				itemsCount = obj.size;
			} else itemsCount = obj.length;
			this.assert(itemsCount >= n, "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " below #{exp}", n, itemsCount);
		} else this.assert(obj >= n, "expected #{this} to be at least #{exp}", "expected #{this} to be below #{exp}", n);
	}
	__name(assertLeast, "assertLeast");
	Assertion.addMethod("least", assertLeast);
	Assertion.addMethod("gte", assertLeast);
	Assertion.addMethod("greaterThanOrEqual", assertLeast);
	function assertBelow(n, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
		if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
		if (!doLength && objType === "date" && nType !== "date") errorMessage = msgPrefix + "the argument to below must be a date";
		else if (!isNumeric(n) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the argument to below must be a number";
		else if (!doLength && objType !== "date" && !isNumeric(obj)) {
			let printObj = objType === "string" ? "'" + obj + "'" : obj;
			errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
		} else shouldThrow = false;
		if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
		if (doLength) {
			let descriptor = "length", itemsCount;
			if (objType === "map" || objType === "set") {
				descriptor = "size";
				itemsCount = obj.size;
			} else itemsCount = obj.length;
			this.assert(itemsCount < n, "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " below #{exp}", n, itemsCount);
		} else this.assert(obj < n, "expected #{this} to be below #{exp}", "expected #{this} to be at least #{exp}", n);
	}
	__name(assertBelow, "assertBelow");
	Assertion.addMethod("below", assertBelow);
	Assertion.addMethod("lt", assertBelow);
	Assertion.addMethod("lessThan", assertBelow);
	function assertMost(n, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), nType = type(n).toLowerCase(), errorMessage, shouldThrow = true;
		if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
		if (!doLength && objType === "date" && nType !== "date") errorMessage = msgPrefix + "the argument to most must be a date";
		else if (!isNumeric(n) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the argument to most must be a number";
		else if (!doLength && objType !== "date" && !isNumeric(obj)) {
			let printObj = objType === "string" ? "'" + obj + "'" : obj;
			errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
		} else shouldThrow = false;
		if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
		if (doLength) {
			let descriptor = "length", itemsCount;
			if (objType === "map" || objType === "set") {
				descriptor = "size";
				itemsCount = obj.size;
			} else itemsCount = obj.length;
			this.assert(itemsCount <= n, "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " above #{exp}", n, itemsCount);
		} else this.assert(obj <= n, "expected #{this} to be at most #{exp}", "expected #{this} to be above #{exp}", n);
	}
	__name(assertMost, "assertMost");
	Assertion.addMethod("most", assertMost);
	Assertion.addMethod("lte", assertMost);
	Assertion.addMethod("lessThanOrEqual", assertMost);
	Assertion.addMethod("within", function(start, finish, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), doLength = flag2(this, "doLength"), flagMsg = flag2(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag2(this, "ssfi"), objType = type(obj).toLowerCase(), startType = type(start).toLowerCase(), finishType = type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
		if (doLength && objType !== "map" && objType !== "set") new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
		if (!doLength && objType === "date" && (startType !== "date" || finishType !== "date")) errorMessage = msgPrefix + "the arguments to within must be dates";
		else if ((!isNumeric(start) || !isNumeric(finish)) && (doLength || isNumeric(obj))) errorMessage = msgPrefix + "the arguments to within must be numbers";
		else if (!doLength && objType !== "date" && !isNumeric(obj)) {
			let printObj = objType === "string" ? "'" + obj + "'" : obj;
			errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
		} else shouldThrow = false;
		if (shouldThrow) throw new AssertionError(errorMessage, void 0, ssfi);
		if (doLength) {
			let descriptor = "length", itemsCount;
			if (objType === "map" || objType === "set") {
				descriptor = "size";
				itemsCount = obj.size;
			} else itemsCount = obj.length;
			this.assert(itemsCount >= start && itemsCount <= finish, "expected #{this} to have a " + descriptor + " within " + range, "expected #{this} to not have a " + descriptor + " within " + range);
		} else this.assert(obj >= start && obj <= finish, "expected #{this} to be within " + range, "expected #{this} to not be within " + range);
	});
	function assertInstanceOf(constructor, msg) {
		if (msg) flag2(this, "message", msg);
		let target = flag2(this, "object");
		let ssfi = flag2(this, "ssfi");
		let flagMsg = flag2(this, "message");
		let isInstanceOf;
		try {
			isInstanceOf = target instanceof constructor;
		} catch (err) {
			if (err instanceof TypeError) {
				flagMsg = flagMsg ? flagMsg + ": " : "";
				throw new AssertionError(flagMsg + "The instanceof assertion needs a constructor but " + type(constructor) + " was given.", void 0, ssfi);
			}
			throw err;
		}
		let name = getName(constructor);
		if (name == null) name = "an unnamed constructor";
		this.assert(isInstanceOf, "expected #{this} to be an instance of " + name, "expected #{this} to not be an instance of " + name);
	}
	__name(assertInstanceOf, "assertInstanceOf");
	Assertion.addMethod("instanceof", assertInstanceOf);
	Assertion.addMethod("instanceOf", assertInstanceOf);
	function assertProperty(name, val, msg) {
		if (msg) flag2(this, "message", msg);
		let isNested = flag2(this, "nested"), isOwn = flag2(this, "own"), flagMsg = flag2(this, "message"), obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), nameType = typeof name;
		flagMsg = flagMsg ? flagMsg + ": " : "";
		if (isNested) {
			if (nameType !== "string") throw new AssertionError(flagMsg + "the argument to property must be a string when using nested syntax", void 0, ssfi);
		} else if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") throw new AssertionError(flagMsg + "the argument to property must be a string, number, or symbol", void 0, ssfi);
		if (isNested && isOwn) throw new AssertionError(flagMsg + "The \"nested\" and \"own\" flags cannot be combined.", void 0, ssfi);
		if (obj === null || obj === void 0) throw new AssertionError(flagMsg + "Target cannot be null or undefined.", void 0, ssfi);
		let isDeep = flag2(this, "deep"), negate = flag2(this, "negate"), pathInfo = isNested ? getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name], isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
		let descriptor = "";
		if (isDeep) descriptor += "deep ";
		if (isOwn) descriptor += "own ";
		if (isNested) descriptor += "nested ";
		descriptor += "property ";
		let hasProperty2;
		if (isOwn) hasProperty2 = Object.prototype.hasOwnProperty.call(obj, name);
		else if (isNested) hasProperty2 = pathInfo.exists;
		else hasProperty2 = hasProperty(obj, name);
		if (!negate || arguments.length === 1) this.assert(hasProperty2, "expected #{this} to have " + descriptor + inspect2(name), "expected #{this} to not have " + descriptor + inspect2(name));
		if (arguments.length > 1) this.assert(hasProperty2 && isEql(val, value), "expected #{this} to have " + descriptor + inspect2(name) + " of #{exp}, but got #{act}", "expected #{this} to not have " + descriptor + inspect2(name) + " of #{act}", val, value);
		flag2(this, "object", value);
	}
	__name(assertProperty, "assertProperty");
	Assertion.addMethod("property", assertProperty);
	function assertOwnProperty(_name, _value, _msg) {
		flag2(this, "own", true);
		assertProperty.apply(this, arguments);
	}
	__name(assertOwnProperty, "assertOwnProperty");
	Assertion.addMethod("ownProperty", assertOwnProperty);
	Assertion.addMethod("haveOwnProperty", assertOwnProperty);
	function assertOwnPropertyDescriptor(name, descriptor, msg) {
		if (typeof descriptor === "string") {
			msg = descriptor;
			descriptor = null;
		}
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object");
		let actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
		let eql = flag2(this, "eql");
		if (actualDescriptor && descriptor) this.assert(eql(descriptor, actualDescriptor), "expected the own property descriptor for " + inspect2(name) + " on #{this} to match " + inspect2(descriptor) + ", got " + inspect2(actualDescriptor), "expected the own property descriptor for " + inspect2(name) + " on #{this} to not match " + inspect2(descriptor), descriptor, actualDescriptor, true);
		else this.assert(actualDescriptor, "expected #{this} to have an own property descriptor for " + inspect2(name), "expected #{this} to not have an own property descriptor for " + inspect2(name));
		flag2(this, "object", actualDescriptor);
	}
	__name(assertOwnPropertyDescriptor, "assertOwnPropertyDescriptor");
	Assertion.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
	Assertion.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
	function assertLengthChain() {
		flag2(this, "doLength", true);
	}
	__name(assertLengthChain, "assertLengthChain");
	function assertLength(n, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), objType = type(obj).toLowerCase(), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), descriptor = "length", itemsCount;
		switch (objType) {
			case "map":
			case "set":
				descriptor = "size";
				itemsCount = obj.size;
				break;
			default:
				new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
				itemsCount = obj.length;
		}
		this.assert(itemsCount == n, "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " of #{act}", n, itemsCount);
	}
	__name(assertLength, "assertLength");
	Assertion.addChainableMethod("length", assertLength, assertLengthChain);
	Assertion.addChainableMethod("lengthOf", assertLength, assertLengthChain);
	function assertMatch(re, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object");
		this.assert(re.exec(obj), "expected #{this} to match " + re, "expected #{this} not to match " + re);
	}
	__name(assertMatch, "assertMatch");
	Assertion.addMethod("match", assertMatch);
	Assertion.addMethod("matches", assertMatch);
	Assertion.addMethod("string", function(str, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object");
		new Assertion(obj, flag2(this, "message"), flag2(this, "ssfi"), true).is.a("string");
		this.assert(~obj.indexOf(str), "expected #{this} to contain " + inspect2(str), "expected #{this} to not contain " + inspect2(str));
	});
	function assertKeys(keys) {
		let obj = flag2(this, "object"), objType = type(obj), keysType = type(keys), ssfi = flag2(this, "ssfi"), isDeep = flag2(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag2(this, "message");
		flagMsg = flagMsg ? flagMsg + ": " : "";
		let mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
		if (objType === "Map" || objType === "Set") {
			deepStr = isDeep ? "deeply " : "";
			actual = [];
			obj.forEach(function(val, key) {
				actual.push(key);
			});
			if (keysType !== "Array") keys = Array.prototype.slice.call(arguments);
		} else {
			actual = getOwnEnumerableProperties(obj);
			switch (keysType) {
				case "Array":
					if (arguments.length > 1) throw new AssertionError(mixedArgsMsg, void 0, ssfi);
					break;
				case "Object":
					if (arguments.length > 1) throw new AssertionError(mixedArgsMsg, void 0, ssfi);
					keys = Object.keys(keys);
					break;
				default: keys = Array.prototype.slice.call(arguments);
			}
			keys = keys.map(function(val) {
				return typeof val === "symbol" ? val : String(val);
			});
		}
		if (!keys.length) throw new AssertionError(flagMsg + "keys required", void 0, ssfi);
		let len = keys.length, any = flag2(this, "any"), all = flag2(this, "all"), expected = keys, isEql = isDeep ? flag2(this, "eql") : (val1, val2) => val1 === val2;
		if (!any && !all) all = true;
		if (any) ok = expected.some(function(expectedKey) {
			return actual.some(function(actualKey) {
				return isEql(expectedKey, actualKey);
			});
		});
		if (all) {
			ok = expected.every(function(expectedKey) {
				return actual.some(function(actualKey) {
					return isEql(expectedKey, actualKey);
				});
			});
			if (!flag2(this, "contains")) ok = ok && keys.length == actual.length;
		}
		if (len > 1) {
			keys = keys.map(function(key) {
				return inspect2(key);
			});
			let last = keys.pop();
			if (all) str = keys.join(", ") + ", and " + last;
			if (any) str = keys.join(", ") + ", or " + last;
		} else str = inspect2(keys[0]);
		str = (len > 1 ? "keys " : "key ") + str;
		str = (flag2(this, "contains") ? "contain " : "have ") + str;
		this.assert(ok, "expected #{this} to " + deepStr + str, "expected #{this} to not " + deepStr + str, expected.slice(0).sort(compareByInspect), actual.sort(compareByInspect), true);
	}
	__name(assertKeys, "assertKeys");
	Assertion.addMethod("keys", assertKeys);
	Assertion.addMethod("key", assertKeys);
	function assertThrows(errorLike, errMsgMatcher, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), ssfi = flag2(this, "ssfi"), flagMsg = flag2(this, "message"), negate = flag2(this, "negate") || false;
		new Assertion(obj, flagMsg, ssfi, true).is.a("function");
		if (isRegExp2(errorLike) || typeof errorLike === "string") {
			errMsgMatcher = errorLike;
			errorLike = null;
		}
		let caughtErr;
		let errorWasThrown = false;
		try {
			obj();
		} catch (err) {
			errorWasThrown = true;
			caughtErr = err;
		}
		let everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
		let everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
		let errorLikeFail = false;
		let errMsgMatcherFail = false;
		if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
			let errorLikeString = "an error";
			if (errorLike instanceof Error) errorLikeString = "#{exp}";
			else if (errorLike) errorLikeString = check_error_exports.getConstructorName(errorLike);
			let actual = caughtErr;
			if (caughtErr instanceof Error) actual = caughtErr.toString();
			else if (typeof caughtErr === "string") actual = caughtErr;
			else if (caughtErr && (typeof caughtErr === "object" || typeof caughtErr === "function")) try {
				actual = check_error_exports.getConstructorName(caughtErr);
			} catch (_err) {}
			this.assert(errorWasThrown, "expected #{this} to throw " + errorLikeString, "expected #{this} to not throw an error but #{act} was thrown", errorLike && errorLike.toString(), actual);
		}
		if (errorLike && caughtErr) {
			if (errorLike instanceof Error) {
				if (check_error_exports.compatibleInstance(caughtErr, errorLike) === negate) if (everyArgIsDefined && negate) errorLikeFail = true;
				else this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""), errorLike.toString(), caughtErr.toString());
			}
			if (check_error_exports.compatibleConstructor(caughtErr, errorLike) === negate) if (everyArgIsDefined && negate) errorLikeFail = true;
			else this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr));
		}
		if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
			let placeholder = "including";
			if (isRegExp2(errMsgMatcher)) placeholder = "matching";
			if (check_error_exports.compatibleMessage(caughtErr, errMsgMatcher) === negate) if (everyArgIsDefined && negate) errMsgMatcherFail = true;
			else this.assert(negate, "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}", "expected #{this} to throw error not " + placeholder + " #{exp}", errMsgMatcher, check_error_exports.getMessage(caughtErr));
		}
		if (errorLikeFail && errMsgMatcherFail) this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && check_error_exports.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && check_error_exports.getConstructorName(caughtErr));
		flag2(this, "object", caughtErr);
	}
	__name(assertThrows, "assertThrows");
	Assertion.addMethod("throw", assertThrows);
	Assertion.addMethod("throws", assertThrows);
	Assertion.addMethod("Throw", assertThrows);
	function respondTo(method, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), itself = flag2(this, "itself"), context = "function" === typeof obj && !itself ? obj.prototype[method] : obj[method];
		this.assert("function" === typeof context, "expected #{this} to respond to " + inspect2(method), "expected #{this} to not respond to " + inspect2(method));
	}
	__name(respondTo, "respondTo");
	Assertion.addMethod("respondTo", respondTo);
	Assertion.addMethod("respondsTo", respondTo);
	Assertion.addProperty("itself", function() {
		flag2(this, "itself", true);
	});
	function satisfy(matcher, msg) {
		if (msg) flag2(this, "message", msg);
		let result = matcher(flag2(this, "object"));
		this.assert(result, "expected #{this} to satisfy " + objDisplay(matcher), "expected #{this} to not satisfy" + objDisplay(matcher), flag2(this, "negate") ? false : true, result);
	}
	__name(satisfy, "satisfy");
	Assertion.addMethod("satisfy", satisfy);
	Assertion.addMethod("satisfies", satisfy);
	function closeTo(expected, delta, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
		new Assertion(obj, flagMsg, ssfi, true).is.numeric;
		let message = "A `delta` value is required for `closeTo`";
		if (delta == void 0) throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
		new Assertion(delta, flagMsg, ssfi, true).is.numeric;
		message = "A `expected` value is required for `closeTo`";
		if (expected == void 0) throw new AssertionError(flagMsg ? `${flagMsg}: ${message}` : message, void 0, ssfi);
		new Assertion(expected, flagMsg, ssfi, true).is.numeric;
		const abs = /* @__PURE__ */ __name((x) => x < 0 ? -x : x, "abs");
		const strip = /* @__PURE__ */ __name((number) => parseFloat(parseFloat(number).toPrecision(12)), "strip");
		this.assert(strip(abs(obj - expected)) <= delta, "expected #{this} to be close to " + expected + " +/- " + delta, "expected #{this} not to be close to " + expected + " +/- " + delta);
	}
	__name(closeTo, "closeTo");
	Assertion.addMethod("closeTo", closeTo);
	Assertion.addMethod("approximately", closeTo);
	function isSubsetOf(_subset, _superset, cmp, contains, ordered) {
		let superset = Array.from(_superset);
		let subset = Array.from(_subset);
		if (!contains) {
			if (subset.length !== superset.length) return false;
			superset = superset.slice();
		}
		return subset.every(function(elem, idx) {
			if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
			if (!cmp) {
				let matchIdx = superset.indexOf(elem);
				if (matchIdx === -1) return false;
				if (!contains) superset.splice(matchIdx, 1);
				return true;
			}
			return superset.some(function(elem2, matchIdx) {
				if (!cmp(elem, elem2)) return false;
				if (!contains) superset.splice(matchIdx, 1);
				return true;
			});
		});
	}
	__name(isSubsetOf, "isSubsetOf");
	Assertion.addMethod("members", function(subset, msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
		new Assertion(obj, flagMsg, ssfi, true).to.be.iterable;
		new Assertion(subset, flagMsg, ssfi, true).to.be.iterable;
		let contains = flag2(this, "contains");
		let ordered = flag2(this, "ordered");
		let subject, failMsg, failNegateMsg;
		if (contains) {
			subject = ordered ? "an ordered superset" : "a superset";
			failMsg = "expected #{this} to be " + subject + " of #{exp}";
			failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
		} else {
			subject = ordered ? "ordered members" : "members";
			failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
			failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
		}
		let cmp = flag2(this, "deep") ? flag2(this, "eql") : void 0;
		this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
	});
	Assertion.addProperty("iterable", function(msg) {
		if (msg) flag2(this, "message", msg);
		let obj = flag2(this, "object");
		this.assert(obj != void 0 && obj[Symbol.iterator], "expected #{this} to be an iterable", "expected #{this} to not be an iterable", obj);
	});
	function oneOf(list, msg) {
		if (msg) flag2(this, "message", msg);
		let expected = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi"), contains = flag2(this, "contains"), isDeep = flag2(this, "deep"), eql = flag2(this, "eql");
		new Assertion(list, flagMsg, ssfi, true).to.be.an("array");
		if (contains) this.assert(list.some(function(possibility) {
			return expected.indexOf(possibility) > -1;
		}), "expected #{this} to contain one of #{exp}", "expected #{this} to not contain one of #{exp}", list, expected);
		else if (isDeep) this.assert(list.some(function(possibility) {
			return eql(expected, possibility);
		}), "expected #{this} to deeply equal one of #{exp}", "expected #{this} to deeply equal one of #{exp}", list, expected);
		else this.assert(list.indexOf(expected) > -1, "expected #{this} to be one of #{exp}", "expected #{this} to not be one of #{exp}", list, expected);
	}
	__name(oneOf, "oneOf");
	Assertion.addMethod("oneOf", oneOf);
	function assertChanges(subject, prop, msg) {
		if (msg) flag2(this, "message", msg);
		let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
		new Assertion(fn, flagMsg, ssfi, true).is.a("function");
		let initial;
		if (!prop) {
			new Assertion(subject, flagMsg, ssfi, true).is.a("function");
			initial = subject();
		} else {
			new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
			initial = subject[prop];
		}
		fn();
		let final = prop === void 0 || prop === null ? subject() : subject[prop];
		let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
		flag2(this, "deltaMsgObj", msgObj);
		flag2(this, "initialDeltaValue", initial);
		flag2(this, "finalDeltaValue", final);
		flag2(this, "deltaBehavior", "change");
		flag2(this, "realDelta", final !== initial);
		this.assert(initial !== final, "expected " + msgObj + " to change", "expected " + msgObj + " to not change");
	}
	__name(assertChanges, "assertChanges");
	Assertion.addMethod("change", assertChanges);
	Assertion.addMethod("changes", assertChanges);
	function assertIncreases(subject, prop, msg) {
		if (msg) flag2(this, "message", msg);
		let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
		new Assertion(fn, flagMsg, ssfi, true).is.a("function");
		let initial;
		if (!prop) {
			new Assertion(subject, flagMsg, ssfi, true).is.a("function");
			initial = subject();
		} else {
			new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
			initial = subject[prop];
		}
		new Assertion(initial, flagMsg, ssfi, true).is.a("number");
		fn();
		let final = prop === void 0 || prop === null ? subject() : subject[prop];
		let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
		flag2(this, "deltaMsgObj", msgObj);
		flag2(this, "initialDeltaValue", initial);
		flag2(this, "finalDeltaValue", final);
		flag2(this, "deltaBehavior", "increase");
		flag2(this, "realDelta", final - initial);
		this.assert(final - initial > 0, "expected " + msgObj + " to increase", "expected " + msgObj + " to not increase");
	}
	__name(assertIncreases, "assertIncreases");
	Assertion.addMethod("increase", assertIncreases);
	Assertion.addMethod("increases", assertIncreases);
	function assertDecreases(subject, prop, msg) {
		if (msg) flag2(this, "message", msg);
		let fn = flag2(this, "object"), flagMsg = flag2(this, "message"), ssfi = flag2(this, "ssfi");
		new Assertion(fn, flagMsg, ssfi, true).is.a("function");
		let initial;
		if (!prop) {
			new Assertion(subject, flagMsg, ssfi, true).is.a("function");
			initial = subject();
		} else {
			new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
			initial = subject[prop];
		}
		new Assertion(initial, flagMsg, ssfi, true).is.a("number");
		fn();
		let final = prop === void 0 || prop === null ? subject() : subject[prop];
		let msgObj = prop === void 0 || prop === null ? initial : "." + prop;
		flag2(this, "deltaMsgObj", msgObj);
		flag2(this, "initialDeltaValue", initial);
		flag2(this, "finalDeltaValue", final);
		flag2(this, "deltaBehavior", "decrease");
		flag2(this, "realDelta", initial - final);
		this.assert(final - initial < 0, "expected " + msgObj + " to decrease", "expected " + msgObj + " to not decrease");
	}
	__name(assertDecreases, "assertDecreases");
	Assertion.addMethod("decrease", assertDecreases);
	Assertion.addMethod("decreases", assertDecreases);
	function assertDelta(delta, msg) {
		if (msg) flag2(this, "message", msg);
		let msgObj = flag2(this, "deltaMsgObj");
		let initial = flag2(this, "initialDeltaValue");
		let final = flag2(this, "finalDeltaValue");
		let behavior = flag2(this, "deltaBehavior");
		let realDelta = flag2(this, "realDelta");
		let expression;
		if (behavior === "change") expression = Math.abs(final - initial) === Math.abs(delta);
		else expression = realDelta === Math.abs(delta);
		this.assert(expression, "expected " + msgObj + " to " + behavior + " by " + delta, "expected " + msgObj + " to not " + behavior + " by " + delta);
	}
	__name(assertDelta, "assertDelta");
	Assertion.addMethod("by", assertDelta);
	Assertion.addProperty("extensible", function() {
		let obj = flag2(this, "object");
		let isExtensible = obj === Object(obj) && Object.isExtensible(obj);
		this.assert(isExtensible, "expected #{this} to be extensible", "expected #{this} to not be extensible");
	});
	Assertion.addProperty("sealed", function() {
		let obj = flag2(this, "object");
		let isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
		this.assert(isSealed, "expected #{this} to be sealed", "expected #{this} to not be sealed");
	});
	Assertion.addProperty("frozen", function() {
		let obj = flag2(this, "object");
		let isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
		this.assert(isFrozen, "expected #{this} to be frozen", "expected #{this} to not be frozen");
	});
	Assertion.addProperty("finite", function(_msg) {
		let obj = flag2(this, "object");
		this.assert(typeof obj === "number" && isFinite(obj), "expected #{this} to be a finite number", "expected #{this} to not be a finite number");
	});
	function compareSubset(expected, actual) {
		if (expected === actual) return true;
		if (typeof actual !== typeof expected) return false;
		if (typeof expected !== "object" || expected === null) return expected === actual;
		if (!actual) return false;
		if (Array.isArray(expected)) {
			if (!Array.isArray(actual)) return false;
			return expected.every(function(exp) {
				return actual.some(function(act) {
					return compareSubset(exp, act);
				});
			});
		}
		if (expected instanceof Date) if (actual instanceof Date) return expected.getTime() === actual.getTime();
		else return false;
		return Object.keys(expected).every(function(key) {
			let expectedValue = expected[key];
			let actualValue = actual[key];
			if (typeof expectedValue === "object" && expectedValue !== null && actualValue !== null) return compareSubset(expectedValue, actualValue);
			if (typeof expectedValue === "function") return expectedValue(actualValue);
			return actualValue === expectedValue;
		});
	}
	__name(compareSubset, "compareSubset");
	Assertion.addMethod("containSubset", function(expected) {
		const actual = flag(this, "object");
		const showDiff = config.showDiff;
		this.assert(compareSubset(expected, actual), "expected #{act} to contain subset #{exp}", "expected #{act} to not contain subset #{exp}", expected, actual, showDiff);
	});
	function expect(val, message) {
		return new Assertion(val, message);
	}
	__name(expect, "expect");
	expect.fail = function(actual, expected, message, operator) {
		if (arguments.length < 2) {
			message = actual;
			actual = void 0;
		}
		message = message || "expect.fail()";
		throw new AssertionError(message, {
			actual,
			expected,
			operator
		}, expect.fail);
	};
	var should_exports = {};
	__export(should_exports, {
		Should: () => Should,
		should: () => should
	});
	function loadShould() {
		function shouldGetter() {
			if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) return new Assertion(this.valueOf(), null, shouldGetter);
			return new Assertion(this, null, shouldGetter);
		}
		__name(shouldGetter, "shouldGetter");
		function shouldSetter(value) {
			Object.defineProperty(this, "should", {
				value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		}
		__name(shouldSetter, "shouldSetter");
		Object.defineProperty(Object.prototype, "should", {
			set: shouldSetter,
			get: shouldGetter,
			configurable: true
		});
		let should2 = {};
		should2.fail = function(actual, expected, message, operator) {
			if (arguments.length < 2) {
				message = actual;
				actual = void 0;
			}
			message = message || "should.fail()";
			throw new AssertionError(message, {
				actual,
				expected,
				operator
			}, should2.fail);
		};
		should2.equal = function(actual, expected, message) {
			new Assertion(actual, message).to.equal(expected);
		};
		should2.Throw = function(fn, errt, errs, msg) {
			new Assertion(fn, msg).to.Throw(errt, errs);
		};
		should2.exist = function(val, msg) {
			new Assertion(val, msg).to.exist;
		};
		should2.not = {};
		should2.not.equal = function(actual, expected, msg) {
			new Assertion(actual, msg).to.not.equal(expected);
		};
		should2.not.Throw = function(fn, errt, errs, msg) {
			new Assertion(fn, msg).to.not.Throw(errt, errs);
		};
		should2.not.exist = function(val, msg) {
			new Assertion(val, msg).to.not.exist;
		};
		should2["throw"] = should2["Throw"];
		should2.not["throw"] = should2.not["Throw"];
		return should2;
	}
	__name(loadShould, "loadShould");
	var should = loadShould;
	var Should = loadShould;
	function assert(express, errmsg) {
		new Assertion(null, null, assert, true).assert(express, errmsg, "[ negation message unavailable ]");
	}
	__name(assert, "assert");
	assert.fail = function(actual, expected, message, operator) {
		if (arguments.length < 2) {
			message = actual;
			actual = void 0;
		}
		message = message || "assert.fail()";
		throw new AssertionError(message, {
			actual,
			expected,
			operator
		}, assert.fail);
	};
	assert.isOk = function(val, msg) {
		new Assertion(val, msg, assert.isOk, true).is.ok;
	};
	assert.isNotOk = function(val, msg) {
		new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
	};
	assert.equal = function(act, exp, msg) {
		let test2 = new Assertion(act, msg, assert.equal, true);
		test2.assert(exp == flag(test2, "object"), "expected #{this} to equal #{exp}", "expected #{this} to not equal #{act}", exp, act, true);
	};
	assert.notEqual = function(act, exp, msg) {
		let test2 = new Assertion(act, msg, assert.notEqual, true);
		test2.assert(exp != flag(test2, "object"), "expected #{this} to not equal #{exp}", "expected #{this} to equal #{act}", exp, act, true);
	};
	assert.strictEqual = function(act, exp, msg) {
		new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
	};
	assert.notStrictEqual = function(act, exp, msg) {
		new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
	};
	assert.deepEqual = assert.deepStrictEqual = function(act, exp, msg) {
		new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
	};
	assert.notDeepEqual = function(act, exp, msg) {
		new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
	};
	assert.isAbove = function(val, abv, msg) {
		new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
	};
	assert.isAtLeast = function(val, atlst, msg) {
		new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
	};
	assert.isBelow = function(val, blw, msg) {
		new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
	};
	assert.isAtMost = function(val, atmst, msg) {
		new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
	};
	assert.isTrue = function(val, msg) {
		new Assertion(val, msg, assert.isTrue, true).is["true"];
	};
	assert.isNotTrue = function(val, msg) {
		new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
	};
	assert.isFalse = function(val, msg) {
		new Assertion(val, msg, assert.isFalse, true).is["false"];
	};
	assert.isNotFalse = function(val, msg) {
		new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
	};
	assert.isNull = function(val, msg) {
		new Assertion(val, msg, assert.isNull, true).to.equal(null);
	};
	assert.isNotNull = function(val, msg) {
		new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
	};
	assert.isNaN = function(val, msg) {
		new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
	};
	assert.isNotNaN = function(value, message) {
		new Assertion(value, message, assert.isNotNaN, true).not.to.be.NaN;
	};
	assert.exists = function(val, msg) {
		new Assertion(val, msg, assert.exists, true).to.exist;
	};
	assert.notExists = function(val, msg) {
		new Assertion(val, msg, assert.notExists, true).to.not.exist;
	};
	assert.isUndefined = function(val, msg) {
		new Assertion(val, msg, assert.isUndefined, true).to.equal(void 0);
	};
	assert.isDefined = function(val, msg) {
		new Assertion(val, msg, assert.isDefined, true).to.not.equal(void 0);
	};
	assert.isCallable = function(value, message) {
		new Assertion(value, message, assert.isCallable, true).is.callable;
	};
	assert.isNotCallable = function(value, message) {
		new Assertion(value, message, assert.isNotCallable, true).is.not.callable;
	};
	assert.isObject = function(val, msg) {
		new Assertion(val, msg, assert.isObject, true).to.be.a("object");
	};
	assert.isNotObject = function(val, msg) {
		new Assertion(val, msg, assert.isNotObject, true).to.not.be.a("object");
	};
	assert.isArray = function(val, msg) {
		new Assertion(val, msg, assert.isArray, true).to.be.an("array");
	};
	assert.isNotArray = function(val, msg) {
		new Assertion(val, msg, assert.isNotArray, true).to.not.be.an("array");
	};
	assert.isString = function(val, msg) {
		new Assertion(val, msg, assert.isString, true).to.be.a("string");
	};
	assert.isNotString = function(val, msg) {
		new Assertion(val, msg, assert.isNotString, true).to.not.be.a("string");
	};
	assert.isNumber = function(val, msg) {
		new Assertion(val, msg, assert.isNumber, true).to.be.a("number");
	};
	assert.isNotNumber = function(val, msg) {
		new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a("number");
	};
	assert.isNumeric = function(val, msg) {
		new Assertion(val, msg, assert.isNumeric, true).is.numeric;
	};
	assert.isNotNumeric = function(val, msg) {
		new Assertion(val, msg, assert.isNotNumeric, true).is.not.numeric;
	};
	assert.isFinite = function(val, msg) {
		new Assertion(val, msg, assert.isFinite, true).to.be.finite;
	};
	assert.isBoolean = function(val, msg) {
		new Assertion(val, msg, assert.isBoolean, true).to.be.a("boolean");
	};
	assert.isNotBoolean = function(val, msg) {
		new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a("boolean");
	};
	assert.typeOf = function(val, type3, msg) {
		new Assertion(val, msg, assert.typeOf, true).to.be.a(type3);
	};
	assert.notTypeOf = function(value, type3, message) {
		new Assertion(value, message, assert.notTypeOf, true).to.not.be.a(type3);
	};
	assert.instanceOf = function(val, type3, msg) {
		new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type3);
	};
	assert.notInstanceOf = function(val, type3, msg) {
		new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(type3);
	};
	assert.include = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.include, true).include(inc);
	};
	assert.notInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
	};
	assert.deepInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
	};
	assert.notDeepInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
	};
	assert.nestedInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
	};
	assert.notNestedInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(inc);
	};
	assert.deepNestedInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(inc);
	};
	assert.notDeepNestedInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.notDeepNestedInclude, true).not.deep.nested.include(inc);
	};
	assert.ownInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
	};
	assert.notOwnInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
	};
	assert.deepOwnInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.deepOwnInclude, true).deep.own.include(inc);
	};
	assert.notDeepOwnInclude = function(exp, inc, msg) {
		new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(inc);
	};
	assert.match = function(exp, re, msg) {
		new Assertion(exp, msg, assert.match, true).to.match(re);
	};
	assert.notMatch = function(exp, re, msg) {
		new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
	};
	assert.property = function(obj, prop, msg) {
		new Assertion(obj, msg, assert.property, true).to.have.property(prop);
	};
	assert.notProperty = function(obj, prop, msg) {
		new Assertion(obj, msg, assert.notProperty, true).to.not.have.property(prop);
	};
	assert.propertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.propertyVal, true).to.have.property(prop, val);
	};
	assert.notPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(prop, val);
	};
	assert.deepPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(prop, val);
	};
	assert.notDeepPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
	};
	assert.ownProperty = function(obj, prop, msg) {
		new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
	};
	assert.notOwnProperty = function(obj, prop, msg) {
		new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(prop);
	};
	assert.ownPropertyVal = function(obj, prop, value, msg) {
		new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(prop, value);
	};
	assert.notOwnPropertyVal = function(obj, prop, value, msg) {
		new Assertion(obj, msg, assert.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
	};
	assert.deepOwnPropertyVal = function(obj, prop, value, msg) {
		new Assertion(obj, msg, assert.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
	};
	assert.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
		new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
	};
	assert.nestedProperty = function(obj, prop, msg) {
		new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(prop);
	};
	assert.notNestedProperty = function(obj, prop, msg) {
		new Assertion(obj, msg, assert.notNestedProperty, true).to.not.have.nested.property(prop);
	};
	assert.nestedPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.nestedPropertyVal, true).to.have.nested.property(prop, val);
	};
	assert.notNestedPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
	};
	assert.deepNestedPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
	};
	assert.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
		new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
	};
	assert.lengthOf = function(exp, len, msg) {
		new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
	};
	assert.hasAnyKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
	};
	assert.hasAllKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
	};
	assert.containsAllKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(keys);
	};
	assert.doesNotHaveAnyKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
	};
	assert.doesNotHaveAllKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
	};
	assert.hasAnyDeepKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
	};
	assert.hasAllDeepKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
	};
	assert.containsAllDeepKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
	};
	assert.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
	};
	assert.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
		new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
	};
	assert.throws = function(fn, errorLike, errMsgMatcher, msg) {
		if ("string" === typeof errorLike || errorLike instanceof RegExp) {
			errMsgMatcher = errorLike;
			errorLike = null;
		}
		return flag(new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher), "object");
	};
	assert.doesNotThrow = function(fn, errorLike, errMsgMatcher, message) {
		if ("string" === typeof errorLike || errorLike instanceof RegExp) {
			errMsgMatcher = errorLike;
			errorLike = null;
		}
		new Assertion(fn, message, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
	};
	assert.operator = function(val, operator, val2, msg) {
		let ok;
		switch (operator) {
			case "==":
				ok = val == val2;
				break;
			case "===":
				ok = val === val2;
				break;
			case ">":
				ok = val > val2;
				break;
			case ">=":
				ok = val >= val2;
				break;
			case "<":
				ok = val < val2;
				break;
			case "<=":
				ok = val <= val2;
				break;
			case "!=":
				ok = val != val2;
				break;
			case "!==":
				ok = val !== val2;
				break;
			default:
				msg = msg ? msg + ": " : msg;
				throw new AssertionError(msg + "Invalid operator \"" + operator + "\"", void 0, assert.operator);
		}
		let test2 = new Assertion(ok, msg, assert.operator, true);
		test2.assert(true === flag(test2, "object"), "expected " + inspect2(val) + " to be " + operator + " " + inspect2(val2), "expected " + inspect2(val) + " to not be " + operator + " " + inspect2(val2));
	};
	assert.closeTo = function(act, exp, delta, msg) {
		new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
	};
	assert.approximately = function(act, exp, delta, msg) {
		new Assertion(act, msg, assert.approximately, true).to.be.approximately(exp, delta);
	};
	assert.sameMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
	};
	assert.notSameMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.notSameMembers, true).to.not.have.same.members(set2);
	};
	assert.sameDeepMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.sameDeepMembers, true).to.have.same.deep.members(set2);
	};
	assert.notSameDeepMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
	};
	assert.sameOrderedMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.sameOrderedMembers, true).to.have.same.ordered.members(set2);
	};
	assert.notSameOrderedMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
	};
	assert.sameDeepOrderedMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
	};
	assert.notSameDeepOrderedMembers = function(set1, set2, msg) {
		new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
	};
	assert.includeMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.includeMembers, true).to.include.members(subset);
	};
	assert.notIncludeMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.notIncludeMembers, true).to.not.include.members(subset);
	};
	assert.includeDeepMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.includeDeepMembers, true).to.include.deep.members(subset);
	};
	assert.notIncludeDeepMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
	};
	assert.includeOrderedMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.includeOrderedMembers, true).to.include.ordered.members(subset);
	};
	assert.notIncludeOrderedMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
	};
	assert.includeDeepOrderedMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
	};
	assert.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
		new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
	};
	assert.oneOf = function(inList, list, msg) {
		new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
	};
	assert.isIterable = function(obj, msg) {
		if (obj == void 0 || !obj[Symbol.iterator]) {
			msg = msg ? `${msg} expected ${inspect2(obj)} to be an iterable` : `expected ${inspect2(obj)} to be an iterable`;
			throw new AssertionError(msg, void 0, assert.isIterable);
		}
	};
	assert.changes = function(fn, obj, prop, msg) {
		if (arguments.length === 3 && typeof obj === "function") {
			msg = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
	};
	assert.changesBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.changesBy, true).to.change(obj, prop).by(delta);
	};
	assert.doesNotChange = function(fn, obj, prop, msg) {
		if (arguments.length === 3 && typeof obj === "function") {
			msg = prop;
			prop = null;
		}
		return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
	};
	assert.changesButNotBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
	};
	assert.increases = function(fn, obj, prop, msg) {
		if (arguments.length === 3 && typeof obj === "function") {
			msg = prop;
			prop = null;
		}
		return new Assertion(fn, msg, assert.increases, true).to.increase(obj, prop);
	};
	assert.increasesBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.increasesBy, true).to.increase(obj, prop).by(delta);
	};
	assert.doesNotIncrease = function(fn, obj, prop, msg) {
		if (arguments.length === 3 && typeof obj === "function") {
			msg = prop;
			prop = null;
		}
		return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
	};
	assert.increasesButNotBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
	};
	assert.decreases = function(fn, obj, prop, msg) {
		if (arguments.length === 3 && typeof obj === "function") {
			msg = prop;
			prop = null;
		}
		return new Assertion(fn, msg, assert.decreases, true).to.decrease(obj, prop);
	};
	assert.decreasesBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.decreasesBy, true).to.decrease(obj, prop).by(delta);
	};
	assert.doesNotDecrease = function(fn, obj, prop, msg) {
		if (arguments.length === 3 && typeof obj === "function") {
			msg = prop;
			prop = null;
		}
		return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
	};
	assert.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		return new Assertion(fn, msg, assert.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
	};
	assert.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
		if (arguments.length === 4 && typeof obj === "function") {
			let tmpMsg = delta;
			delta = prop;
			msg = tmpMsg;
		} else if (arguments.length === 3) {
			delta = prop;
			prop = null;
		}
		new Assertion(fn, msg, assert.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
	};
	assert.ifError = function(val) {
		if (val) throw val;
	};
	assert.isExtensible = function(obj, msg) {
		new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
	};
	assert.isNotExtensible = function(obj, msg) {
		new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
	};
	assert.isSealed = function(obj, msg) {
		new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
	};
	assert.isNotSealed = function(obj, msg) {
		new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
	};
	assert.isFrozen = function(obj, msg) {
		new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
	};
	assert.isNotFrozen = function(obj, msg) {
		new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
	};
	assert.isEmpty = function(val, msg) {
		new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
	};
	assert.isNotEmpty = function(val, msg) {
		new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
	};
	assert.containsSubset = function(val, exp, msg) {
		new Assertion(val, msg).to.containSubset(exp);
	};
	assert.doesNotContainSubset = function(val, exp, msg) {
		new Assertion(val, msg).to.not.containSubset(exp);
	};
	for (const [name, as] of [
		["isOk", "ok"],
		["isNotOk", "notOk"],
		["throws", "throw"],
		["throws", "Throw"],
		["isExtensible", "extensible"],
		["isNotExtensible", "notExtensible"],
		["isSealed", "sealed"],
		["isNotSealed", "notSealed"],
		["isFrozen", "frozen"],
		["isNotFrozen", "notFrozen"],
		["isEmpty", "empty"],
		["isNotEmpty", "notEmpty"],
		["isCallable", "isFunction"],
		["isNotCallable", "isNotFunction"],
		["containsSubset", "containSubset"]
	]) assert[as] = assert[name];
	var used = [];
	function use(fn) {
		const exports = {
			use,
			AssertionError,
			util: utils_exports,
			config,
			expect,
			assert,
			Assertion,
			...should_exports
		};
		if (!~used.indexOf(fn)) {
			fn(exports, utils_exports);
			used.push(fn);
		}
		return exports;
	}
	__name(use, "use");

//#endregion
//#region src/tests/suite.ts
	var TestSuite = class {
		constructor(name, logger) {
			_defineProperty(this, "state", {});
			_defineProperty(this, "testCases", []);
			_defineProperty(this, "logger", void 0);
			this.logger = logger;
			this.logger.log("name", name);
		}
		test(name, fn) {
			this.testCases.push({
				name,
				fn
			});
		}
		async run() {
			const startTime = Date.now();
			let passed = 0;
			let failed = 0;
			const tests = this.logger.list("tests");
			for (const testCase of this.testCases) {
				const testStartTime = Date.now();
				const testLogger = tests.scope(testCase.name);
				try {
					const returnValue = await testCase.fn(testLogger.scope("runner"));
					const duration = Date.now() - testStartTime;
					passed++;
					testLogger.log("status", "pass");
					testLogger.log("duration", duration);
					testLogger.log("returnValue", returnValue);
				} catch (error) {
					const duration = Date.now() - testStartTime;
					failed++;
					testLogger.log("status", "fail");
					testLogger.log("error", String(error));
					testLogger.log("duration", duration);
				}
			}
			const totalDuration = Date.now() - startTime;
			const suiteResult = {
				passed,
				failed,
				total: this.testCases.length,
				duration: totalDuration
			};
			this.logger.log("summary", suiteResult);
		}
	};
	const registerDefaultTests = function(suite, extension, extensionInfo, testData = {}) {
		registerDefaultInitialisationTests(suite, extension);
		let sourceCapabilities = 0;
		if (Array.isArray(extensionInfo.capabilities)) sourceCapabilities = extensionInfo.capabilities.reduce((a, b) => a | b, sourceCapabilities);
		else sourceCapabilities = extensionInfo.capabilities;
		if (sourceCapabilities & SourceIntents.SEARCH_RESULT_PROVIDING && testData.searchResultsProviding !== false) if (implementsSearchResultsProviding(extension)) registerDefaultSearchResultsProvidingSourceTests(suite, extension, testData.searchResultsProviding);
		else throw new Error(`extension does not implement 'SearchResultsProviding' but has the 'SEARCH_RESULTS_PROVIDING' capability`);
		if (testData.mangaProviding !== false) registerDefaultMangaProvidingSourceTests(suite, extension, testData.mangaProviding);
		if (sourceCapabilities & SourceIntents.CHAPTER_PROVIDING && testData.chapterProviding !== false) if (implementsChapterProviding(extension)) registerDefaultChapterProvidingSourceTests(suite, extension, testData.chapterProviding);
		else throw new Error(`extension does not implement 'ChapterProviding' but has the 'CHAPTER_PROVIDING' capability`);
	};
	const registerDefaultInitialisationTests = function(suite, extension) {
		suite.test("initialisation", async () => {
			await extension.initialise();
		});
	};
	const STATE_KEY = {
		SearchResultsProviding: {
			getSearchResults: "SearchResultsProviding.getSearchResults",
			getSortingOptions: "SearchResultsProviding.getSortingOptions"
		},
		MangaProviding: { getMangaDetails: "MangaProviding.getMangaDetails" },
		ChapterProviding: {
			getChapters: "ChapterProviding.getChapters",
			getChapterDetails: "ChapterProviding.getChapterDetails"
		}
	};
	const registerDefaultSearchResultsProvidingSourceTests = function(suite, extension, testData) {
		if ("getSortingOptions" in extension && testData?.getSortingOptions !== false) suite.test("getSortingOptions", async () => {
			let params = testData?.getSortingOptions;
			if (!params) params = [{ title: "" }];
			const sortingOptions = await extension.getSortingOptions(...params);
			expect(sortingOptions).not.empty;
			suite.state[STATE_KEY.SearchResultsProviding.getSortingOptions] = sortingOptions;
		});
		if (testData?.getSearchResults !== false) suite.test("getSearchResults", async () => {
			expect(extension).to.have.property("getSearchResults");
			let params = testData?.getSearchResults;
			if (!params) params = [
				{ title: "" },
				void 0,
				suite.state[STATE_KEY.SearchResultsProviding.getSortingOptions]?.[0]
			];
			const searchResults = await extension.getSearchResults(...params);
			expect(searchResults).not.empty;
			expect(searchResults.items).not.be.empty;
			suite.state[STATE_KEY.SearchResultsProviding.getSearchResults] = searchResults;
		});
	};
	const registerDefaultMangaProvidingSourceTests = function(suite, extension, testData) {
		if (testData?.getMangaDetails !== false) suite.test("getMangaDetails", async () => {
			expect(extension).to.have.property("getMangaDetails");
			let params = testData?.getMangaDetails;
			if (!params) {
				const searchResults = suite.state[STATE_KEY.SearchResultsProviding.getSearchResults];
				if (searchResults?.items[0]?.mangaId) params = [searchResults.items[0].mangaId];
				else throw new Error("No `mangaId` provided in test data. Unable to infer from `SearchResultsProviding.getSearchResults`");
			}
			const mangaDetails = await extension.getMangaDetails(...params);
			expect(mangaDetails).to.not.be.undefined;
			expect(mangaDetails.mangaInfo).to.not.be.undefined;
			suite.state[STATE_KEY.MangaProviding.getMangaDetails] = mangaDetails;
		});
	};
	const registerDefaultChapterProvidingSourceTests = function(suite, extension, testData) {
		if (testData?.getChapters !== false) suite.test("getChapters", async () => {
			expect(extension).to.have.property("getChapters");
			let params = testData?.getChapters;
			if (!params) {
				const sourceManga = suite.state[STATE_KEY.MangaProviding.getMangaDetails];
				if (sourceManga) params = [sourceManga];
				else throw new Error("No `sourceManga` provided in test data. Unable to infer from `MangaProviding.getMangaDetails`");
			}
			const chapters = await extension.getChapters(...params);
			expect(chapters).to.not.be.empty;
			suite.state[STATE_KEY.ChapterProviding.getChapters] = chapters;
		});
		if (testData?.getChapterDetails !== false) suite.test("getChapterDetails", async () => {
			expect(extension).to.have.property("getChapterDetails");
			let params = testData?.getChapterDetails;
			if (!params) {
				const chapters = suite.state[STATE_KEY.ChapterProviding.getChapters];
				if (chapters?.[0]) params = [chapters[0]];
				else throw new Error("No `sourceManga` provided in test data. Unable to infer from `MangaProviding.getMangaDetails`");
			}
			const chapterDetails = await extension.getChapterDetails(...params);
			expect(chapterDetails).to.not.be.undefined;
			suite.state[STATE_KEY.ChapterProviding.getChapterDetails] = chapterDetails;
		});
	};

//#endregion
//#region src/tests/AniList.ts
	async function runTests(logger) {
		const suite = new TestSuite("AniList tests", logger);
		registerDefaultTests(suite, AniList, pbconfig_default);
		await suite.run();
	}

//#endregion
exports.runTests = runTests;
return exports;
})({});
//# sourceMappingURL=AniList.js.map