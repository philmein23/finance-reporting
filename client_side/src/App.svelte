<script>
  export let symbol;
  let income_statements = [];

  const camel2title = (camelCase) =>
    camelCase
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase());

  async function getIncomeStatement(symbol) {
    let result = await fetch(`/income-statement/${symbol}`);
    return await result.json();
  }

  function onSearch(e) {
    e.preventDefault();

    return getIncomeStatement(symbol).then((data) => {
      income_statements = data;

      console.log(income_statements);
    });
  }
</script>

<style>
  .test-border {
    border: 1px solid red;
  }
  .grid-row-container {
    display: grid;
    grid-template-rows: repeat(25, 50px);
  }
  .grid-auto-column-container {
    display: grid;
    grid-template-columns: repeat(18, 120px);
    grid-column-gap: 15px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 15px;
    margin: 10px;
  }

  .dates > div {
    margin-right: 15px;
  }

  .income-data {
    margin: 10px 0;
  }
</style>

<main>
  <h1>Income Statements</h1>
  <section>
    <form>
      <input type="text" bind:value={symbol} />
      <button on:click={onSearch}>Search</button>
    </form>
    <div class="grid-container">
      <div class="grid-row-container test-border">
        <div />
        <div>Cost And Expenses</div>
        <div>Cost of Revenue</div>
        <div>Appreciation and Amortization</div>
        <div>EBITDA</div>
        <div>EBITDA Ratio</div>
        <div>EPS</div>
        <div>EPS Diluted</div>
        <div>General and Administrative Expenses</div>
        <div>Gross Profit</div>
        <div>Gross Profit Ratio</div>
        <div>Income Before Tax</div>
        <div>Income Before Tax Ratio</div>
        <div>Income Tax Expense</div>
        <div>Interest Expense</div>
        <div>Net Income</div>
        <div>Net Income Ratio</div>
        <div>Operating Expenses</div>
        <div>Operating Income</div>
        <div>Operating Income Ratio</div>
        <div>Other Expenses</div>
        <div>Research And Development Expenses</div>
        <div>Revenue</div>
        <div>Selling And Marketing Expenses</div>
        <div>Total Other Income Expenses Net</div>
      </div>
      <div class="dates grid-auto-column-container test-border">
        {#each income_statements as i}
          <div class="grid-row-container">
            <div>{i.date}</div>
            <div>{i.costAndExpenses}</div>
            <div>{i.costOfRevenue}</div>
            <div>{i.depreciationAndAmortization}</div>
            <div>{i.ebitda}</div>
            <div>{i.ebitdaratio}</div>
            <div>{i.eps}</div>
            <div>{i.epsdiluted}</div>
            <div>{i.generalAndAdministrativeExpenses}</div>
            <div>{i.grossProfit}</div>
            <div>{i.grossProfitRatio}</div>
            <div>{i.incomeBeforeTax}</div>
            <div>{i.incomeBeforeTaxRatio}</div>
            <div>{i.incomeTaxExpense}</div>
            <div>{i.interestExpense}</div>
            <div>{i.netIncome}</div>
            <div>{i.netIncomeRatio}</div>
            <div>{i.operatingExpenses}</div>
            <div>{i.operatingIncome}</div>
            <div>{i.operatingIncomeRatio}</div>
            <div>{i.otherExpenses}</div>
            <div>{i.researchAndDevelopmentExpenses}</div>
            <div>{i.revenue}</div>
            <div>{i.sellingAndMarketingExpenses}</div>
            <div>{i.totalOtherIncomeExpensesNet}</div>
          </div>
        {/each}
      </div>
    </div>

  </section>
</main>
