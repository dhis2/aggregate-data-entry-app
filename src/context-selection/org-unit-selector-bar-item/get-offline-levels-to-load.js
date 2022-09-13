/**
 * @param {Object} options
 * @param {Object} options.organisationUnitLevels
 * @param {Integer} options.organisationUnitLevels.level
 * @param {Integer} options.organisationUnitLevels.offlineLevels
 * @param {Object} options.userOrganisationUnits
 * @param {String} options.userOrganisationUnits.id
 * @param {Integer} options.userOrganisationUnits.level
 *
 * @returns {Array.<{ id: String, offlineLevels: Int }>}
 */
export default function getOfflineLevelsToLoad({
    organisationUnitLevels,
    userOrganisationUnits,
}) {
    return userOrganisationUnits
        .map((userOrgUnit) => {
            const foundLevel = organisationUnitLevels.find(
                (orgUnitLevel) => orgUnitLevel.level === userOrgUnit.level
            )

            if (foundLevel) {
                return {
                    id: userOrgUnit.id,
                    offlineLevels: foundLevel.offlineLevels,
                }
            }
        })
        .filter((value) => !!value)
}
