/**
 * Track the trade of a account from one trader to another
 * @param {org.example.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeAccount(trade) {

    // set the new owner of the account 
    if (trade.quantity <= 0 || trade.account.quantity < trade.quantity) return;

    trade.account.quantity -= trade.quantity;
    trade.accountReceive.quantity += trade.quantity;

    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Account');

    // emit a notification that a trade has occurred
    let tradeNotification = getFactory().newEvent('org.example.mynetwork', 'TradeNotification');
    tradeNotification.account = trade.account;
    tradeNotification.accountReceive = trade.accountReceive;
    tradeNotification.quantity = trade.quantity;
    emit(tradeNotification);

    // persist the state of the account as well as accountReceive
    await assetRegistry.update(trade.account);
    await assetRegistry.update(trade.accountReceive);
}
