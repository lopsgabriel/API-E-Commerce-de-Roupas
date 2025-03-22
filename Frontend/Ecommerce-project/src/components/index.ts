import PrivateRoute from "./PrivateRoute/ui/PrivateRoute"; 
import fetchAuthApi from "./AuthApi/ui/AuthApi";
import ToggleWishlist from "./ToggleWishlist/ui/ToggleWishlist";
import CartUpdate from "./CartUpdate/ui/CartUpdate";
import {useSearch} from "./SearchContext/ui/useSearch";
import { SearchProvider } from "./SearchContext/ui/SearchContext";

export { PrivateRoute, fetchAuthApi, ToggleWishlist, CartUpdate, useSearch, SearchProvider };
