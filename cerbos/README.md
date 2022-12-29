# README
## Finance Application Demo

To see this policy in action, check out the code example in Github.
https://github.com/cerbos/demo-graphql

The actors are:
   1. *Sally* works in the sales department in EMEA and submits reports
   2. *Zeena* works in the sales department in the US
   3. *John* is the sales manager in EMEA
   4. *Brock* is the sales manager in US
   5. *Joe* is the finance manager, can approve all the expenses.
   6. *Sajit* is from the IT department, can do anything.
   

## Scenario:
The expense reports sent by *Sally* can be approved by finance department.
Can be only seen by regional manager that matches her region, in this case *John*. 
However, *John* cannot see who approved it, only *Joe* from finance, *Sajit* from
IT, and *Sally* herself can see it.
