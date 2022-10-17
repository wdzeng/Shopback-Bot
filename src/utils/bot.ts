import { OfferListFollowResult, SearchedOffer } from '../lang/offer'
import { IShopbackBot } from '../shopback-bot'

export async function followOffersByKeyword(
  bot: IShopbackBot,
  keyword: string,
  size: number,
  parallel: number
): Promise<OfferListFollowResult> {
  const searchList = await bot.searchOffers(keyword, size)

  for (let i = 0; i < searchList.offers.length; i += parallel) {
    const offers = searchList.offers.slice(i, i + parallel)
    const tasks = offers.map(o => bot.followOffer(o.id, true))
    const results = await Promise.all(tasks)
    for (let j = 0; j < offers.length; j++) {
      const tmp = searchList.offers[i + j] as SearchedOffer
      tmp.newFollowed = results[j]
    }
  }

  return searchList as OfferListFollowResult
}
