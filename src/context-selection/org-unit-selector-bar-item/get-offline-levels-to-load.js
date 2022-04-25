/**
 * @param {Object} data
 * @param {Object} data.organisationUnitLevels
 * @param {Integer} data.organisationUnitLevels.level
 * @param {Integer} data.organisationUnitLevels.offlineLevels
 * @param {Object} data.userOrganisationUnits
 * @param {String} data.userOrganisationUnits.id
 * @param {Integer} data.userOrganisationUnits.level
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
