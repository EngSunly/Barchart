

let datajson;
let dataarray

async function getdata() {


    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

    await fetch(url).then(response => response.json()).then(data => datajson = data);

    dataarray = datajson.data;


    return dataarray;
}
const getpromise = getdata();
data = getpromise.then(createBarChart)

function createBarChart(data) {
    console.log(data);
    // data array is 275 arrays with 2 elements [date, gdp]

    let width = 1000;
    let height = 500;
    let padding = 100;


    // 20000 max is value of gdp in data with length of 275
    // create d3 scale for x axis date format is 1947-01-01	
    let xScale = d3.scaleTime()
        .domain([new Date(data[0][0]), new Date(data[274][0])])
        .range([padding, width - padding])

    // create d3 scale for y axis
    let yScale = d3.scaleLinear()
        .domain([0, 20000])
        .range([height - padding, padding])

    // create svg element
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // create tooltip
    let tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)

    // create bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .style("fill", "blue")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("class", "bar")
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width",2)
        .attr("height", (d) => height - padding - yScale(d[1]))
        .on("mouseover", (d,i) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9)
            tooltip.html(i[0] + "<br>" + "$" + i[1] + " Billion")
                .attr("data-date", i[0])
        })
        .on("mouseout", (d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0)
        })

    // create x axis
    let xAxis = d3.axisBottom(xScale)
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)

    // create y axis
    let yAxis = d3.axisLeft(yScale)
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)

    // create x axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - padding / 2)
        .text("Year")
        .attr("id", "x-label")


    // create y axis label
    svg.append("text")
        .attr("x", - height / 2)
        .attr("y", padding / 2)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Gross Domestic Product")
        .attr("id", "y-label")

}

