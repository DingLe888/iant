build: clean
	npx tsc --project ./packages/iant
	@echo "build successfully 👨‍❤️‍👨"

clean:
	rm -rf ./packages/iant/lib
	@echo "clean successfully 💖 \n"
