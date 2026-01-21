from prometheus_client import Counter, Histogram, Gauge

service_checks_total = Counter(
    "service_checks_total",
    "Total number of service health checks",
    ["service_name"],
)

service_check_failures_total = Counter(
    "service_check_failures_total",
    "Total number of failed service checks",
    ["service_name"],
)

service_response_time_ms = Histogram(
    "service_response_time_ms",
    "Service response time in milliseconds",
    ["service_name"],
    buckets=(100, 300, 500, 1000, 2000, 5000),
)

service_up = Gauge(
    "service_up",
    "Service availability status (1=UP, 0=DOWN)",
    ["service_name"],
)

service_alerts_total = Counter(
    "service_alerts_total",
    "Total alerts triggered",
    ["service_name"],
)
