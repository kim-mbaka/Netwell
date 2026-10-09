from rest_framework.throttling import SimpleRateThrottle


class LoginRateThrottle(SimpleRateThrottle):
    """
    Per-username cap on login attempts — blunts credential stuffing of a single
    account even when the attacker rotates source IPs. Rate comes from the
    'login' scope in DEFAULT_THROTTLE_RATES.
    """

    scope = "login"

    def get_cache_key(self, request, view):
        username = (request.data.get("username") or "").strip().lower()
        if not username:
            return None  # no username -> don't throttle here (anon throttle covers it)
        return self.cache_format % {"scope": self.scope, "ident": username}
