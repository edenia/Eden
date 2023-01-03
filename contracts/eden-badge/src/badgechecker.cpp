#include <badgechecker/badgechecker.hpp>

namespace eden
{
   void contract::check_authorizer(eosio::name org, eosio::name authorizer)
   {
      checks_table checks_tb(sbt_account, sbt_account.value);
      auto itr = checks_tb.find(org.value);

      eosio::check(itr != checks_tb.end(), "Org not found");

      if (eosio::has_auth(org))
      {
         return;
      }

      eosio::check(itr->checks_contract == authorizer,
                   authorizer.to_string() +
                       " is not authorized to issue sbt on behalf of genesis.eden contract");
   }

   void contract::notify_initsimple(eosio::name org,
                                    eosio::name creator,
                                    eosio::name badge,
                                    std::vector<eosio::name> parent_badges,
                                    std::string offchain_lookup_data,
                                    std::string onchain_lookup_data,
                                    std::vector<eosio::name> consumers,
                                    std::string memo)
   {
      check_authorizer(org, creator);
   }

   void contract::notify_givesimple(eosio::name org,
                                    eosio::name badge,
                                    eosio::name authorizer,
                                    eosio::name to,
                                    std::string memo)
   {
      check_authorizer(org, authorizer);
   }
}  // namespace eden

EOSIO_ACTION_DISPATCHER(eden::actions)
EOSIO_ABIGEN(actions(eden::actions))