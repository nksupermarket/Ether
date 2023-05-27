import { getImage, IMAGE_LS_KEY } from "./Image";
import { getKeyBinds, KEYBINDS_LS_KEY } from "./KeyBinds";
import { getLinks, LINKS_LS_KEY } from "./Links";
import {
  CUSTOM_SEARCH_DETAILS_LS_KEY,
  getCustomSearchDetails,
  getSearch,
  SEARCH_LS_KEY,
} from "./Search";
import { getTheme, THEME_LS_KEY } from "./Theme";

const LocalStorage = {
  getAll: function () {
    const config = {
      [THEME_LS_KEY]: getTheme(),
      [LINKS_LS_KEY]: getLinks(),
      [KEYBINDS_LS_KEY]: getKeyBinds(),
      [IMAGE_LS_KEY]: getImage(),
      [SEARCH_LS_KEY]: getSearch(),
      [CUSTOM_SEARCH_DETAILS_LS_KEY]: getCustomSearchDetails(),
    };
    return config;
  },
  format: function () {
    return JSON.stringify(this.getAll(), null, 2);
  },
};
export default LocalStorage;
