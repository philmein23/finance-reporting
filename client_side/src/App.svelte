<script>
  export let symbol;
  let income_statements = [];
  let dates = [];
  let metrics = [];

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

      if (dates.length === 0 && metrics.length === 0) {
        dates = data.map((dp) => dp.date);
        metrics = Object.keys(data[0]).map((metric) => camel2title(metric));
      }

      console.log(income_statements);
      console.log(metrics);
    });
  }
</script>

<style>
  .flex-column {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .flex-column > div {
    margin: 4px 0;
  }
</style>

<main>
  <h1>Income Statements</h1>
  <section>
    <form>
      <input type="text" bind:value={symbol} />
      <button on:click={onSearch}>Search</button>
    </form>
    <div class="flex-column">
      {#each metrics as metric}
        <div>{metric}</div>
      {/each}
    </div>
  </section>
</main>
