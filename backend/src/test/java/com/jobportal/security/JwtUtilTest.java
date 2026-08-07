package com.jobportal.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    @Test
    void generatesAndValidatesAccessToken() {
        JwtUtil jwtUtil = new JwtUtil("unit-test-secret-key-at-least-32-chars!!", 60_000);
        String token = jwtUtil.generateAccessToken("alex@example.com", "JOB_SEEKER", 42L);

        assertEquals("alex@example.com", jwtUtil.extractUsername(token));
        assertEquals("JOB_SEEKER", jwtUtil.extractRole(token));
        assertEquals(42L, jwtUtil.extractUserId(token));
        assertTrue(jwtUtil.isTokenValid(token, "alex@example.com"));
        assertFalse(jwtUtil.isTokenValid(token, "other@example.com"));
    }
}
