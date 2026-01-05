import { ref } from 'vue'

// Default language is Myanmar
const currentLanguage = ref('myanmar')

const translations = {
  english: {
    // Balance and Currency
    balance: 'Balance',
    availableBalance: 'Available Balance',
    topUpBalance: 'Top Up Balance',
    mmk: 'MMK',
    
    // Game Types
    selectGameType: 'Select Game Type',
    '2dBetting': '2D Betting',
    '3dBetting': '3D Betting',
    'bawdiBetting': 'BawDi Betting',
    'maungBetting': 'Maung Betting',
    pick2Digits: 'Pick 2 digits',
    pick3Digits: 'Pick 3 digits',
    footballBetting: 'Football Betting',
    bodyStyle: 'Body Style',
    maungStyle: 'Maung Style',
    winUpTo85x: 'Win up to 85x',
    winUpTo500x: 'Win up to 500x',
    
    // Recent Results
    recentResults: 'Recent Results',
    viewAll: 'View All',
    morning: 'Morning',
    evening: 'Evening',
    today: 'Today',
    yesterday: 'Yesterday',
    noRecentResults: 'No recent results available',
    mondayToFriday: 'Monday to Friday',
    firstAnd16th: '1st & 16th of month',
    todayResults: 'Today\'s Results',
    latest3D: 'Latest 3D',
    pending: 'Pending',
    noResults: 'No results yet',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    betHistory: 'Bet History',
    profile: 'Profile',
    
    // Betting
    nextDraw: 'Next Draw',
    morningSession: 'Morning Session',
    eveningSession: 'Evening Session',
    selectNumbers: 'Select Your Numbers',
    selectedNumbers: 'Selected Numbers',
    clearAll: 'Clear All',
    quickPick: 'Quick Pick',
    betAmount: 'Bet Amount',
    amountPerNumber: 'Amount per number',
    betSummary: 'Bet Summary',
    numbersSelected: 'Numbers selected',
    totalBet: 'Total bet',
    potentialWin: 'Potential win',
    placeBet: 'Place Bet',
    selectNumbers: 'Select Numbers',
    insufficientBalance: 'Insufficient Balance',
    noNumbersSelected: 'No numbers selected',
    specialPatterns: 'Special Patterns',
    clearPatterns: 'Clear Patterns',
    patternNumbers: 'Pattern Numbers',
    numbers: 'numbers',
    addToSelection: 'Add to Selection',
    reverseHint: 'Reverse numbers',
    
    // 3D Specific
    manualInput: 'Manual Input',
    numberGrid: 'Number Grid',
    your3DNumber: 'Your 3D Number',
    luckyNumber: 'Lucky Number',
    clear: 'Clear',
    enter3Digits: 'Enter 3 Digits',
    lucky1: 'Lucky 1',
    lucky3: 'Lucky 3',
    lucky5: 'Lucky 5',
    amountForNumber: 'Amount for number',
    addPermutations: 'Add Permutations (R)',
    permutationHint: 'Permutation numbers',
    
    // Results
    drawResults: 'Draw Results',
    latestWinningNumbers: 'Latest winning numbers',
    allResults: 'All Results',
    '2dOnly': '2D Only',
    '3dOnly': '3D Only',
    latestWinner: 'Latest Winner',
    winningNumber: 'Winning Number',
    totalBets: 'Total Bets',
    winners: 'Winners',
    loadMoreResults: 'Load More Results',
    statistics: 'Statistics',
    '2dDrawsToday': '2D Draws Today',
    '3dDrawsToday': '3D Draws Today',
    totalWinners: 'Total Winners',
    totalPayout: 'Total Payout',
    hotNumbers: 'Hot Numbers',
    thisWeek: 'This Week',
    '2dHotNumbers': '2D Hot Numbers',
    '3dHotNumbers': '3D Hot Numbers',
    
    // History
    yourBettingRecords: 'Your betting records',
    totalWins: 'Total Wins',
    totalLosses: 'Total Losses',
    netPL: 'Net P&L',
    allBets: 'All Bets',
    won: 'Won',
    lost: 'Lost',
    pending: 'Pending',
    numbers: 'Numbers',
    prizeWon: 'Prize Won',
    drawTime: 'Draw Time',
    loadMoreHistory: 'Load More History',
    
    // Profile
    accountSettings: 'Account settings',
    memberSince: 'Member Since',
    wins: 'Wins',
    totalBets: 'Total Bets',
    accountBalance: 'Account Balance',
    viewTransactions: 'View Transactions',
    topUp: 'Top Up',
    thisMonth: 'This Month',
    betsPlaced: 'Bets Placed',
    amountWon: 'Amount Won',
    favoriteGame: 'Favorite Game',
    winRate: 'Win Rate',
    settings: 'Settings',
    editProfile: 'Edit Profile',
    updatePersonalInfo: 'Update your personal information',
    paymentMethods: 'Payment Methods',
    managePaymentOptions: 'Manage your payment options',
    preferences: 'Preferences',
    notificationsAndGameSettings: 'Notifications and game settings',
    helpSupport: 'Help & Support',
    getHelpOrContactSupport: 'Get help or contact support',
    termsPrivacy: 'Terms & Privacy',
    legalInformationAndPolicies: 'Legal information and policies',
    signOut: 'Sign Out',
    
    // Football Betting
    availableMatches: 'Available Matches',
    loadingMatches: 'Loading matches...',
    kickoff: 'Kickoff',
    home: 'Home',
    draw: 'Draw',
    away: 'Away',
    noMatchesAvailable: 'No matches available',
    checkBackLater: 'Check back later for upcoming matches',
    comingSoon: 'Coming Soon',
    bawdiComingSoon: 'BawDi football betting will be available soon. Stay tuned!',
    maungComingSoon: 'Maung football betting will be available soon. Stay tuned!',
    bawdiDescription: 'Body style football betting with traditional Myanmar format',
    maungDescription: 'Maung style football betting with advanced options',
    bettingOptions: 'Betting Options',
    loadingOptions: 'Loading betting options...',
    overUnder: 'Over/Under',
    over: 'Over',
    under: 'Under',
    handicap: 'Handicap',
    correctScore: 'Correct Score',
    betSlip: 'Bet Slip',
    selection: 'Selection',
    odds: 'Odds',
    stake: 'Stake',
    noAnnouncements: 'No announcements available',
    
    // Bawdi specific
    selectedBets: 'Selected Bets',
    totalAmount: 'Total Amount',
    enterAmount: 'Enter amount',
    refresh: 'Refresh',
    selectBets: 'Select Bets',
    pleaseLogin: 'Please Login',
    betPlacedSuccessfully: 'Bet placed successfully!',
    errorPlacingBet: 'Error placing bet',
    placingBet: 'Placing Bet',
    tomorrow: 'Tomorrow',
    
    // Maung specific
    perSelection: 'per selection',
    amountPerBet: 'Amount per bet',
    matchResult: 'Match Result',
    
    // Wallet specific
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    withdrawal: 'Withdrawal',
    deposits: 'Deposits',
    withdrawals: 'Withdrawals',
    transactions: 'Transactions',
    transactionHistory: 'Transaction History',
    paymentMethod: 'Payment Method',
    paymentMethods: 'Payment Methods',
    selectPaymentMethod: 'Select Payment Method',
    amount: 'Amount',
    withdrawAmount: 'Withdraw Amount',
    withdrawTo: 'Withdraw To',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    active: 'Active',
    transactionId: 'Transaction ID',
    allTransactions: 'All Transactions',
    loadingTransactions: 'Loading transactions...',
    noTransactionsFound: 'No transactions found',
    startTransactingToSeeHistory: 'Start depositing or withdrawing to see history',
    loadMore: 'Load More',
    loading: 'Loading...',
    cancel: 'Cancel',
    depositRequestSubmitted: 'Deposit request submitted successfully',
    withdrawalRequestSubmitted: 'Withdrawal request submitted successfully',
    depositFailed: 'Deposit request failed',
    withdrawalFailed: 'Withdrawal request failed',
    errorProcessingDeposit: 'Error processing deposit',
    errorProcessingWithdrawal: 'Error processing withdrawal',
    
    // Quick Actions
    wallet: 'Wallet',
    manageBalance: 'Manage Balance',
    viewBetHistory: 'View Bet History',
    
    // Profile specific
    name: 'Name',
    phoneNumber: 'Phone Number',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    update: 'Update',
    updating: 'Updating...',
    changePassword: 'Change Password',
    updatePassword: 'Update Password',
    languageSettings: 'Language Settings',
    currentLanguage: 'Current Language',
    languageChanged: 'Language changed successfully',
    profileUpdated: 'Profile updated successfully',
    profileUpdateFailed: 'Failed to update profile',
    passwordChanged: 'Password changed successfully',
    passwordChangeFailed: 'Failed to change password',
    loggedOut: 'Logged out successfully',
    
    // History specific
    noBetsFound: 'No bets found',
    startBettingToSeeHistory: 'Start betting to see your history here',
    
    // Wallet specific - Payment Info
    paymentInformation: 'Payment Information',
    adminAccount: 'Admin Account',
    accountName: 'Account Name',
    transactionId: 'Transaction ID',
    last6Digits: 'Last 6 Digits',
    enterLast6DigitsOfTransactionId: 'Enter the last 6 digits of your transaction ID',
    yourPaymentInformation: 'Your Payment Information',
    provideYourPaymentDetails: 'Provide your payment details for',
    yourAccountNumber: 'Your Account Number',
    yourAccountName: 'Your Account Name',
    enterExactNameOnAccount: 'Enter the exact name on your account',
    
    // Navigation
    home: 'Home'
  },
  
  myanmar: {
    // Balance and Currency
    balance: 'လက်ကျန်ငွေ',
    availableBalance: 'အသုံးပြုနိုင်သော လက်ကျန်ငွေ',
    topUpBalance: 'ငွေဖြည့်ရန်',
    mmk: 'ကျပ်',
    
    // Game Types
    selectGameType: 'ဂိမ်းအမျိုးအစား ရွေးချယ်ပါ',
    '2dBetting': '2D လောင်းကစား',
    '3dBetting': '3D လောင်းကစား',
    'bawdiBetting': 'ဘော်ဒီ လောင်းကစား',
    'maungBetting': 'မောင် လောင်းကစား',
    pick2Digits: '2 လုံး ရွေးပါ',
    pick3Digits: '3 လုံး ရွေးပါ',
    footballBetting: 'ဘောလုံး လောင်းကစား',
    bodyStyle: 'ဘော်ဒီ ပုံစံ',
    maungStyle: 'မောင် ပုံစံ',
    winUpTo85x: '85 ဆအထိ အနိုင်ရနိုင်',
    winUpTo500x: '500 ဆအထိ အနိုင်ရနိုင်',
    
    // Recent Results
    recentResults: 'လတ်တလော ရလဒ်များ',
    viewAll: 'အားလုံးကြည့်ရန်',
    morning: 'နံနက်',
    evening: 'ညနေ',
    today: 'ယနေ့',
    yesterday: 'မနေ့က',
    noRecentResults: 'လတ်တလော ရလဒ်များ မရှိပါ',
    mondayToFriday: 'တနင်္လာ မှ သောကြာ',
    firstAnd16th: 'လ၏ ၁ ရက် နှင့် ၁၆ ရက်',
    todayResults: 'ယနေ့ ရလဒ်များ',
    latest3D: 'နောက်ဆုံး 3D',
    pending: 'စောင့်ဆိုင်းဆဲ',
    noResults: 'ရလဒ်များ မရှိသေးပါ',
    
    // Quick Actions
    quickActions: 'လျင်မြန်သော လုပ်ဆောင်ချက်များ',
    betHistory: 'လောင်းကစား မှတ်တမ်း',
    profile: 'ပရိုဖိုင်',
    
    // Betting
    nextDraw: 'နောက်ထုတ်မည့် အကြိမ်',
    morningSession: 'နံနက်ပိုင်း',
    eveningSession: 'ညနေပိုင်း',
    selectNumbers: 'သင့်နံပါတ်များ ရွေးချယ်ပါ',
    selectedNumbers: 'ရွေးချယ်ထားသော နံပါတ်များ',
    clearAll: 'အားလုံး ရှင်းလင်းရန်',
    quickPick: 'လျင်မြန်စွာ ရွေးချယ်ရန်',
    betAmount: 'လောင်းကစား ပမာဏ',
    amountPerNumber: 'နံပါတ်တစ်လုံးအတွက် ပမာဏ',
    betSummary: 'လောင်းကစား အကျဉ်းချုပ်',
    numbersSelected: 'ရွေးချယ်ထားသော နံပါတ်များ',
    totalBet: 'စုစုပေါင်း လောင်းကစား',
    potentialWin: 'အနိုင်ရနိုင်သော ပမာဏ',
    placeBet: 'လောင်းကစား ထားရန်',
    selectNumbers: 'နံပါတ်များ ရွေးချယ်ပါ',
    insufficientBalance: 'လက်ကျန်ငွေ မလုံလောက်ပါ',
    noNumbersSelected: 'ရွေးချယ်ထားသော နံပါတ်များ မရှိပါ',
    specialPatterns: 'အထူး ပုံစံများ',
    clearPatterns: 'ပုံစံများ ရှင်းလင်းရန်',
    patternNumbers: 'ပုံစံ နံပါတ်များ',
    numbers: 'နံပါတ်များ',
    addToSelection: 'ရွေးချယ်မှုတွင် ထည့်ရန်',
    specialPatterns: 'အထူး ပုံစံများ',
    clearPatterns: 'ပုံစံများ ရှင်းလင်းရန်',
    patternNumbers: 'ပုံစံ နံပါတ်များ',
    numbers: 'နံပါတ်များ',
    addToSelection: 'ရွေးချယ်မှုတွင် ထည့်ရန်',
    
    // Results
    drawResults: 'ထုတ်ပေါက် ရလဒ်များ',
    latestWinningNumbers: 'နောက်ဆုံး အနိုင်ရ နံပါတ်များ',
    allResults: 'ရလဒ် အားလုံး',
    '2dOnly': '2D သာ',
    '3dOnly': '3D သာ',
    latestWinner: 'နောက်ဆုံး အနိုင်ရသူ',
    winningNumber: 'အနိုင်ရ နံပါတ်',
    totalBets: 'စုစုပေါင်း လောင်းကစားများ',
    winners: 'အနိုင်ရသူများ',
    loadMoreResults: 'ရလဒ် ပိုမို ကြည့်ရန်',
    statistics: 'စာရင်းအင်းများ',
    '2dDrawsToday': 'ယနေ့ 2D ထုတ်ပေါက်မှုများ',
    '3dDrawsToday': 'ယနေ့ 3D ထုတ်ပေါက်မှုများ',
    totalWinners: 'စုစုပေါင်း အနိုင်ရသူများ',
    totalPayout: 'စုစုပေါင်း ပေးချေမှု',
    hotNumbers: 'ရေပန်းစားသော နံပါတ်များ',
    thisWeek: 'ဒီအပတ်',
    '2dHotNumbers': '2D ရေပန်းစားသော နံပါတ်များ',
    '3dHotNumbers': '3D ရေပန်းစားသော နံပါတ်များ',
    
    // History
    yourBettingRecords: 'သင့် လောင်းကစား မှတ်တမ်းများ',
    totalWins: 'စုစုပေါင်း အနိုင်',
    totalLosses: 'စုစုပေါင်း အရှုံး',
    netPL: 'အသားတင် အရှုံးတင်',
    allBets: 'အားလုံး',
    won: 'အနိုင်',
    lost: 'အရှုံး',
    pending: 'စောင့်ဆိုင်းဆဲ',
    numbers: 'နံပါတ်များ',
    prizeWon: 'ရရှိသော ဆုငွေ',
    drawTime: 'ထုတ်ပေါက် အချိန်',
    loadMoreHistory: 'မှတ်တမ်း ပိုမို ကြည့်ရန်',
    
    // Profile
    accountSettings: 'အကောင့် ဆက်တင်များ',
    memberSince: 'အဖွဲ့ဝင် ဖြစ်ကတည်းက',
    wins: 'အနိုင်',
    totalBets: 'စုစုပေါင်း လောင်းကစားများ',
    accountBalance: 'အကောင့် လက်ကျန်ငွေ',
    viewTransactions: 'ငွေလွှဲမှုများ ကြည့်ရန်',
    topUp: 'ငွေဖြည့်ရန်',
    thisMonth: 'ဒီလ',
    betsPlaced: 'ထားသော လောင်းကစားများ',
    amountWon: 'အနိုင်ရသော ပမာဏ',
    favoriteGame: 'အကြိုက်ဆုံး ဂိမ်း',
    winRate: 'အနိုင်ရ နှုန်း',
    settings: 'ဆက်တင်များ',
    editProfile: 'ပရိုဖိုင် တည်းဖြတ်ရန်',
    updatePersonalInfo: 'သင့် ကိုယ်ရေးကိုယ်တာ အချက်အလက်များ အပ်ဒိတ်လုပ်ရန်',
    paymentMethods: 'ငွေပေးချေမှု နည်းလမ်းများ',
    managePaymentOptions: 'သင့် ငွေပေးချေမှု ရွေးချယ်စရာများ စီမံခန့်ခွဲရန်',
    preferences: 'နှစ်သက်မှုများ',
    notificationsAndGameSettings: 'အကြောင်းကြားချက်များနှင့် ဂိမ်း ဆက်တင်များ',
    helpSupport: 'အကူအညီနှင့် ပံ့ပိုးမှု',
    getHelpOrContactSupport: 'အကူအညီရယူရန် သို့မဟုတ် ပံ့ပိုးမှုနှင့် ဆက်သွယ်ရန်',
    termsPrivacy: 'စည်းမျဉ်းများနှင့် ကိုယ်ရေးကိုယ်တာ',
    legalInformationAndPolicies: 'ဥပဒေဆိုင်ရာ အချက်အလက်များနှင့် မူဝါဒများ',
    signOut: 'ထွက်ရန်',
    
    // Football Betting
    availableMatches: 'ရရှိနိုင်သော ပွဲများ',
    loadingMatches: 'ပွဲများ ရှာနေသည်...',
    kickoff: 'စတင်ချိန်',
    home: 'အိမ်ရှင်',
    draw: 'သရေ',
    away: 'ဧည့်သည်',
    noMatchesAvailable: 'ပွဲများ မရှိပါ',
    checkBackLater: 'နောက်ပိုင်း ပွဲများအတွက် ပြန်ကြည့်ပါ',
    comingSoon: 'မကြာမီ ရောက်မည်',
    bawdiComingSoon: 'ဘော်ဒီ ဘောလုံး လောင်းကစား မကြာမီ ရရှိနိုင်မည်။ စောင့်ကြည့်ပါ!',
    maungComingSoon: 'မောင် ဘောလုံး လောင်းကစား မကြာမီ ရရှိနိုင်မည်။ စောင့်ကြည့်ပါ!',
    bawdiDescription: 'မြန်မာ ရိုးရာ ပုံစံဖြင့် ဘော်ဒီ ဘောလုံး လောင်းကစား',
    maungDescription: 'အဆင့်မြင့် ရွေးချယ်မှုများဖြင့် မောင် ဘောလုံး လောင်းကစား',
    bettingOptions: 'လောင်းကစား ရွေးချယ်မှုများ',
    loadingOptions: 'လောင်းကစား ရွေးချယ်မှုများ ရှာနေသည်...',
    overUnder: 'အထက်/အောက်',
    over: 'အထက်',
    under: 'အောက်',
    handicap: 'ဟန်ဒီကပ်',
    correctScore: 'မှန်ကန်သော ရမှတ်',
    betSlip: 'လောင်းကစား လက်မှတ်',
    selection: 'ရွေးချယ်မှု',
    odds: 'အချိုး',
    stake: 'လောင်းကြေး',
    noAnnouncements: 'ကြေညာချက်များ မရှိပါ',
    reverseHint: 'ပြောင်းပြန် နံပါတ်များ',
    
    // Bawdi specific
    selectedBets: 'ရွေးချယ်ထားသော လောင်းကစားများ',
    totalAmount: 'စုစုပေါင်း ပမာဏ',
    enterAmount: 'ပမာဏ ရိုက်ထည့်ပါ',
    refresh: 'ပြန်လည်ရယူရန်',
    selectBets: 'လောင်းကစားများ ရွေးချယ်ပါ',
    pleaseLogin: 'ကျေးဇူးပြု၍ လော့ဂ်အင်ဝင်ပါ',
    betPlacedSuccessfully: 'လောင်းကစား အောင်မြင်စွာ ထားပြီးပါပြီ!',
    errorPlacingBet: 'လောင်းကစား ထားရာတွင် အမှားရှိပါသည်',
    placingBet: 'လောင်းကစား ထားနေသည်',
    tomorrow: 'မနက်ဖြန်',
    
    // Maung specific
    perSelection: 'ရွေးချယ်မှုတစ်ခုအတွက်',
    amountPerBet: 'လောင်းကစားတစ်ခုအတွက် ပမာဏ',
    matchResult: 'ပွဲရလဒ်',
    
    // Wallet specific
    deposit: 'ငွေဖြည့်ခြင်း',
    withdraw: 'ငွေထုတ်ခြင်း',
    withdrawal: 'ငွေထုတ်ခြင်း',
    deposits: 'ငွေဖြည့်မှုများ',
    withdrawals: 'ငွေထုတ်မှုများ',
    transactions: 'ငွေလွှဲမှုများ',
    transactionHistory: 'ငွေလွှဲမှု မှတ်တမ်း',
    paymentMethod: 'ငွေပေးချေမှု နည်းလမ်း',
    paymentMethods: 'ငွေပေးချေမှု နည်းလမ်းများ',
    selectPaymentMethod: 'ငွေပေးချေမှု နည်းလမ်း ရွေးချယ်ပါ',
    amount: 'ပမာဏ',
    withdrawAmount: 'ထုတ်မည့် ပမာဏ',
    withdrawTo: 'ထုတ်မည့် နေရာ',
    processing: 'လုပ်ဆောင်နေသည်',
    completed: 'ပြီးစီးပြီ',
    failed: 'မအောင်မြင်ပါ',
    cancelled: 'ပယ်ဖျက်ပြီး',
    active: 'အသုံးပြုနိုင်သော',
    transactionId: 'ငွေလွှဲမှု နံပါတ်',
    allTransactions: 'ငွေလွှဲမှု အားလုံး',
    loadingTransactions: 'ငွေလွှဲမှုများ ရှာနေသည်...',
    noTransactionsFound: 'ငွေလွှဲမှုများ မတွေ့ပါ',
    startTransactingToSeeHistory: 'မှတ်တမ်းများ မြင်ရန် ငွေဖြည့် သို့မဟုတ် ငွေထုတ် စတင်ပါ',
    loadMore: 'ပိုမို ကြည့်ရန်',
    loading: 'ရှာနေသည်...',
    cancel: 'ပယ်ဖျက်ရန်',
    depositRequestSubmitted: 'ငွေဖြည့်မှု တောင်းဆိုချက် အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ',
    withdrawalRequestSubmitted: 'ငွေထုတ်မှု တောင်းဆိုချက် အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ',
    depositFailed: 'ငွေဖြည့်မှု တောင်းဆိုချက် မအောင်မြင်ပါ',
    withdrawalFailed: 'ငွေထုတ်မှု တောင်းဆိုချက် မအောင်မြင်ပါ',
    errorProcessingDeposit: 'ငွေဖြည့်မှု လုပ်ဆောင်ရာတွင် အမှားရှိပါသည်',
    errorProcessingWithdrawal: 'ငွေထုတ်မှု လုပ်ဆောင်ရာတွင် အမှားရှိပါသည်',
    
    // Quick Actions
    wallet: 'ပိုက်ဆံအိတ်',
    manageBalance: 'လက်ကျန်ငွေ စီမံခန့်ခွဲရန်',
    viewBetHistory: 'လောင်းကစား မှတ်တမ်း ကြည့်ရန်',
    
    // Profile specific
    name: 'အမည်',
    phoneNumber: 'ဖုန်းနံပါတ်',
    currentPassword: 'လက်ရှိ စကားဝှက်',
    newPassword: 'စကားဝှက် အသစ်',
    update: 'အပ်ဒိတ်လုပ်ရန်',
    updating: 'အပ်ဒိတ်လုပ်နေသည်...',
    changePassword: 'စကားဝှက် ပြောင်းလဲရန်',
    updatePassword: 'စကားဝှက် အပ်ဒိတ်လုပ်ရန်',
    languageSettings: 'ဘာသာစကား ဆက်တင်များ',
    currentLanguage: 'လက်ရှိ ဘာသာစကား',
    languageChanged: 'ဘာသာစကား အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ',
    profileUpdated: 'ပရိုဖိုင် အောင်မြင်စွာ အပ်ဒိတ်လုပ်ပြီးပါပြီ',
    profileUpdateFailed: 'ပရိုဖိုင် အပ်ဒိတ်လုပ်ရာတွင် မအောင်မြင်ပါ',
    passwordChanged: 'စကားဝှက် အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ',
    passwordChangeFailed: 'စကားဝှက် ပြောင်းလဲရာတွင် မအောင်မြင်ပါ',
    loggedOut: 'အောင်မြင်စွာ ထွက်ပြီးပါပြီ',
    
    // History specific
    noBetsFound: 'လောင်းကစားများ မတွေ့ပါ',
    startBettingToSeeHistory: 'မှတ်တမ်းများ မြင်ရန် လောင်းကစား စတင်ပါ',
    
    // Wallet specific - Payment Info
    paymentInformation: 'ငွေပေးချေမှု အချက်အလက်',
    adminAccount: 'အက်ဒမင် အကောင့်',
    accountName: 'အကောင့် အမည်',
    transactionId: 'ငွေလွှဲမှု နံပါတ်',
    last6Digits: 'နောက်ဆုံး ၆ လုံး',
    enterLast6DigitsOfTransactionId: 'သင့် ငွေလွှဲမှု နံပါတ်၏ နောက်ဆုံး ၆ လုံး ရိုက်ထည့်ပါ',
    yourPaymentInformation: 'သင့် ငွေပေးချေမှု အချက်အလက်',
    provideYourPaymentDetails: 'သင့် ငွေပေးချေမှု အချက်အလက်များ ပေးပါ',
    yourAccountNumber: 'သင့် အကောင့် နံပါတ်',
    yourAccountName: 'သင့် အကောင့် အမည်',
    enterExactNameOnAccount: 'သင့် အကောင့်ပေါ်ရှိ အမည်အတိုင်း ရိုက်ထည့်ပါ',
    
    // Navigation
    home: 'ပင်မစာမျက်နှာ',
    
    // 3D Specific
    manualInput: 'လက်ဖြင့် ရိုက်ထည့်ခြင်း',
    numberGrid: 'နံပါတ် ဇယား',
    your3DNumber: 'သင့် 3D နံပါတ်',
    luckyNumber: 'ကံကောင်းသော နံပါတ်',
    clear: 'ရှင်းလင်းရန်',
    enter3Digits: '3 လုံး ရိုက်ထည့်ပါ',
    lucky1: 'ကံကောင်း 1 လုံး',
    lucky3: 'ကံကောင်း 3 လုံး',
    lucky5: 'ကံကောင်း 5 လုံး',
    amountForNumber: 'နံပါတ်အတွက် ပမာဏ'
  }
}

// Add new translations
translations.english.addPermutations = 'Add Permutations (R)'
translations.english.permutationHint = 'Permutation numbers'
translations.myanmar.addPermutations = 'ပြောင်းလဲမှုများ ထည့်ရန် (R)'
translations.myanmar.permutationHint = 'ပြောင်းလဲ နံပါတ်များ'

// Soccer bet details translations
translations.english.betDetails = 'Bet Details'
translations.english.betAmount = 'Bet Amount'
translations.english.winAmount = 'Win Amount'
translations.english.bawdi = 'Bawdi'
translations.english.maung = 'Maung'
translations.english.homeTeam = 'Home'
translations.english.awayTeam = 'Away'
translations.english.overGoal = 'Over'
translations.english.underGoal = 'Under'
translations.english.football = 'Football'
translations.english.back = 'Back'
translations.english.betNotFound = 'Bet not found'
translations.english.kyat = 'MMK'

translations.myanmar.betDetails = 'လောင်းကြေး အသေးစိတ်'
translations.myanmar.betAmount = 'လောင်းငွေ'
translations.myanmar.winAmount = 'အနိုင်ရငွေ'
translations.myanmar.bawdi = 'ဘော်ဒီ'
translations.myanmar.maung = 'မောင်း'
translations.myanmar.homeTeam = 'အိမ်ကွင်း'
translations.myanmar.awayTeam = 'အဝေးကွင်း'
translations.myanmar.overGoal = 'ဂိုးပေါ်'
translations.myanmar.underGoal = 'ဂိုးအောက်'
translations.myanmar.football = 'ဘောလုံး'
translations.myanmar.back = 'နောက်သို့'
translations.myanmar.betNotFound = 'လောင်းကြေး မတွေ့ပါ'
translations.myanmar.kyat = 'ကျပ်'

export const useLanguage = () => {
  const t = (key) => {
    return translations[currentLanguage.value][key] || key
  }
  
  const setLanguage = (lang) => {
    currentLanguage.value = lang
  }
  
  const getCurrentLanguage = () => {
    return currentLanguage.value
  }
  
  return {
    t,
    setLanguage,
    getCurrentLanguage,
    currentLanguage
  }
}