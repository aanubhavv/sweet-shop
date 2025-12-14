# Test Report

## Backend Test Suite Results

Command executed:
```bash
pytest

```

results:
```bash
====================================== test session starts ======================================        
platform win32 -- Python 3.12.3, pytest-9.0.2, pluggy-1.6.0
rootdir: D:\Programming\sweet-shop\backend
app\tests\test_health.py .                                                                 [ 23%]        
app\tests\test_inventory.py ...                                                            [ 41%]        
app\tests\test_security.py ...                                                             [ 58%]        
app\tests\test_sweets.py ...                                                                      [ 76%] 
app\tests\test_sweets_search.py .                                                                 [ 82%] 
app\tests\test_sweets_update_delete.py ..                                                         [ 94%] 
app\tests\test_user_repository.py .                                                               [100%] 

========================================== 17 passed in 6.09s ==========================================

```

Summary:

Total tests: 17

Passed: 17

Failed: 0

Coverage: Core backend logic (auth, sweets, inventory, security, DB)

All tests passed successfully.
