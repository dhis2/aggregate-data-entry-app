export const validationMetadata = {
    pager: {
        page: 1,
        total: 37,
        pageSize: 50,
        pageCount: 1,
    },
    validationRules: [
        {
            importance: 'HIGH',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{GCGfEY82Wz6.Prlt0C1RF0s}',
                description:
                    'At Measles, slept under LLITN last night, <1 year Fixed',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'At Measles, slept under LLITN last night, <1 year Fixed',
            },
            rightSide: {
                translations: [],
                expression: '#{YtbsuPPo010.Prlt0C1RF0s}',
                description: 'Measles, <1 year Fixed[34.292]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Measles, <1 year Fixed[34.292]',
            },
            displayInstruction:
                'Slept under LLIN at measles (fixed < 1y) cannot be higher than measles doses given (fixed < 1y)',
            displayDescription: 'Question asked at Measles',
            displayName: 'Measles, Slept under LLITN last night, <1 year Fixed',
            id: 'sxamEpoUXb5',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{mGN1az8Xub6}',
                description: 'PCV 2',
                slidingWindow: false,
                missingValueStrategy: 'NEVER_SKIP',
                displayDescription: 'PCV 2',
            },
            rightSide: {
                translations: [],
                expression: '#{xc8gmAKfO95}',
                description: 'PCV 1',
                slidingWindow: false,
                missingValueStrategy: 'NEVER_SKIP',
                displayDescription: 'PCV 1',
            },
            displayInstruction: 'PCV 2 cannot be higher than PCV 1 doses given',
            displayDescription:
                'PCV 2 must be equal or lower than PCV 1 doses given',
            displayName: 'PCV 2 <= PCV 1',
            id: 'P2igXCbites',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{L2kxa2IA2cs}',
                description: 'PCV 3',
                slidingWindow: false,
                missingValueStrategy: 'NEVER_SKIP',
                displayDescription: 'PCV 3',
            },
            rightSide: {
                translations: [],
                expression: '#{mGN1az8Xub6}',
                description: 'PCV 2',
                slidingWindow: false,
                missingValueStrategy: 'NEVER_SKIP',
                displayDescription: 'PCV 2',
            },
            displayInstruction: 'PCV 3 cannot be higher than PCV 2 doses given',
            displayDescription:
                'PCV 3 must be equal or lower than PCV 2 doses given',
            displayName: 'PCV 3 <= PCV 2',
            id: 'aSo0d3XGZgY',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{pEOVd4Z3TAS.Prlt0C1RF0s}',
                description:
                    'People asked at Penta3 if Exclusive breastfeeding, <1 year Fixed',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'People asked at Penta3 if Exclusive breastfeeding, <1 year Fixed',
            },
            rightSide: {
                translations: [],
                expression: '#{n6aMJNLdvep.Prlt0C1RF0s}',
                description: 'Penta3, <1 year Fixed[25.292]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Penta3, <1 year Fixed[25.292]',
            },
            displayInstruction:
                'Exclusive breastfeeding at time of penta 3 (fixed < 1y) cannot be higher than penta 3 doses given (fixed < 1y)',
            displayDescription: 'Question asked at Penta3 vs number of Penta3',
            displayName: 'Penta3, Exclusive breastfeeding, <1 year Fixed',
            id: 'B3cosSOA63b',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{pEOVd4Z3TAS.V6L425pT3A0}',
                description:
                    'People asked at Penta3 if Exclusive breastfeeding, <1 year Outreach',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'People asked at Penta3 if Exclusive breastfeeding, <1 year Outreach',
            },
            rightSide: {
                translations: [],
                expression: '#{n6aMJNLdvep.V6L425pT3A0}',
                description: 'Penta3, <1 year Outreach[25.290]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Penta3, <1 year Outreach[25.290]',
            },
            displayInstruction:
                'Exclusive breastfeeding at time of penta 3 (outreach < 1y) cannot be higher than penta 3 doses given (outreach < 1y)',
            displayDescription: 'Question asked at Penta3 vs number of Penta3',
            displayName: 'Penta3, Exclusive breastfeeding, <1 year Outreach',
            id: 'O7I6pSSF79K',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{dU0GquGkGQr.Prlt0C1RF0s}',
                description: 'Question asked at BCG, < 12 m Fixed',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Question asked at BCG, < 12 m Fixed',
            },
            rightSide: {
                translations: [],
                expression: '#{s46m5MS0hxu.Prlt0C1RF0s}',
                description: 'BCG doses given < 12 m Fixed',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'BCG doses given < 12 m Fixed',
            },
            displayInstruction:
                'Early breastfeeding at BCG (fixed) cannot be higher than BCG doses given (fixed)',
            displayDescription:
                'Early breastfeeding at BCG (fixed) cannot be higher than BCG doses given (fixed)',
            displayName: 'BCG, Early breastfeeding, <1 year Fixed',
            id: 'wVUSW5c5Pkp',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{GCGfEY82Wz6.psbwp3CQEhs}',
                description:
                    'At Measles, Slept under LLITN last night, >=1 year Fixed',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'At Measles, Slept under LLITN last night, >=1 year Fixed',
            },
            rightSide: {
                translations: [],
                expression: '#{YtbsuPPo010.psbwp3CQEhs}',
                description: 'Measles, >=1 year Fixed[34.291]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Measles, >=1 year Fixed[34.291]',
            },
            displayInstruction:
                'Slept under LLIN at measles (fixed > 1y) cannot be higher than measles doses given (fixed > 1y)',
            displayDescription: 'Question asked at Measles',
            displayName:
                'Measles, Slept under LLITN last night, >=1 year Fixed',
            id: 'sWlF63K4G6c',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{pEOVd4Z3TAS.hEFKSsPV5et}',
                description:
                    'People asked at Penta3 if Exclusive breastfeeding, >=1 year Outreach',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'People asked at Penta3 if Exclusive breastfeeding, >=1 year Outreach',
            },
            rightSide: {
                translations: [],
                expression: '#{n6aMJNLdvep.hEFKSsPV5et}',
                description: 'Penta3, >=1 year Outreach[25.289]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Penta3, >=1 year Outreach[25.289]',
            },
            displayInstruction:
                'Exclusive breastfeeding at time of penta 3 (outreach > 1y) cannot be higher than penta 3 doses given (outreach > 1y)',
            displayDescription: 'Question asked at Penta3 vs number of Penta3',
            displayName: 'Penta3, Exclusive breastfeeding, >=1 year Outreach',
            id: 'rdZFSe8Ay0r',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{GCGfEY82Wz6.hEFKSsPV5et}',
                description:
                    'At Measles, Slept under LLITN last night, >=1 year Outreach',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'At Measles, Slept under LLITN last night, >=1 year Outreach',
            },
            rightSide: {
                translations: [],
                expression: '#{YtbsuPPo010.hEFKSsPV5et}',
                description: 'Measles, >=1 year Outreach[34.289]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Measles, >=1 year Outreach[34.289]',
            },
            displayInstruction:
                'Slept under LLIN at measles (outreach > 1y) cannot be higher than measles doses given (outreach > 1y)',
            displayDescription: 'Question asked at Measles',
            displayName:
                'Measles, Slept under LLITN last night, >=1 year Outreach',
            id: 'ZRLOcDaREUF',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{pEOVd4Z3TAS.psbwp3CQEhs}',
                description:
                    'People asked at Penta3 if Exclusive breastfeeding, >=1 year Fixed',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'People asked at Penta3 if Exclusive breastfeeding, >=1 year Fixed',
            },
            rightSide: {
                translations: [],
                expression: '#{n6aMJNLdvep.psbwp3CQEhs}',
                description: 'Penta3, >=1 year Fixed[25.291]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Penta3, >=1 year Fixed[25.291]',
            },
            displayInstruction:
                'Exclusive breastfeeding at time of penta 3 (fixed > 1y) cannot be higher than penta 3 doses given (fixed > 1y)',
            displayDescription: 'Question asked at Penta3 vs number of Penta3',
            displayName: 'Penta3, Exclusive breastfeeding, >=1 year Fixed',
            id: 'UGR3QXRZZGL',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{dU0GquGkGQr.V6L425pT3A0}',
                description:
                    'Asked at BCG if early breastfeeding, < 12 m Outreach',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'Asked at BCG if early breastfeeding, < 12 m Outreach',
            },
            rightSide: {
                translations: [],
                expression: '#{s46m5MS0hxu.V6L425pT3A0}',
                description: 'BCG doses given < 12 Outreach',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'BCG doses given < 12 Outreach',
            },
            displayInstruction:
                'Early breastfeeding at BCG (outreach) cannot be higher than BCG doses given (outreach)',
            displayDescription:
                'Early breastfeeding at BCG (outreach) cannot be higher than BCG doses given (outreach)',
            displayName: 'BCG, Early breastfeeding, <1 year Outreach',
            id: 'Xk6lYPtiA1e',
        },
        {
            importance: 'MEDIUM',
            operator: 'less_than_or_equal_to',
            leftSide: {
                translations: [],
                expression: '#{GCGfEY82Wz6.V6L425pT3A0}',
                description:
                    'At Measles, Slept under LLITN last night, <1 year Outreach',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription:
                    'At Measles, Slept under LLITN last night, <1 year Outreach',
            },
            rightSide: {
                translations: [],
                expression: '#{YtbsuPPo010.V6L425pT3A0}',
                description: 'Measles, <1 year Outreach[34.290]',
                slidingWindow: false,
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                displayDescription: 'Measles, <1 year Outreach[34.290]',
            },
            displayInstruction:
                'Slept under LLIN at measles (outreach <1y) cannot be higher than measles doses given (outreach <1y)',
            displayDescription: 'Question asked at Measles',
            displayName:
                'Measles, Slept under LLITN last night, <1 year Outreach',
            id: 'AtsPA2YokRq',
        },
    ],
}
