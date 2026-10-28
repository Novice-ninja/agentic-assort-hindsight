import { LicenseManager } from 'ag-grid-enterprise';

/**
 * Temporary hardcoded AG Grid Enterprise licence for local/dev grids.
 * Prefer `env.agGridLicenseKey` / `APP_AG_GRID_LICENSE_KEY` when moving off this shortcut.
 */
export const AG_GRID_LICENSE_KEY =
  'Using_this_{AG_Grid}_Enterprise_key_{AG-082017}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Impact_Analytics}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{28_February_2027}____[v3]_[01]_MTgwMzc3MjgwMDAwMA==d3fb103fa88b52d1f7ad90bf7e94f9a5';

LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);
