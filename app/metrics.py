from prometheus_client import Counter, Histogram

# Total checks performed
CHECK_TOTAL = Counter(
    "service_checks_total",
    "Total number of service checks",
    ["service_name"]
)

# Service failures
CHECK_FAILURES = Counter(
    "service_check_failures_total",
    "Total number of failed checks",
    ["service_name"]
)

# Response time
RESPONSE_TIME = Histogram(
    "service_response_time_ms",
    "Service response time in milliseconds",
    ["service_name"]
)
